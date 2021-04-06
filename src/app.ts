/* eslint-disable max-len */
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import apicache from 'apicache';
// GOOGLE DRIVE VARS
import express from 'express';
import GoogleDriveApi from './GoogleDriveApiClient';
// SERVER VARS
// Database vars
import DatabaseAdapter from './Database/DatabaseAdapter';
// Database Logger
import DBLogger from './DBLogger';
// Enums
import { DOWNLOAD_STATUS as downloadStatus } from './utils/enums';
// helpers
import { deleteTmpFolder } from './utils/helper';

const GDriveApi = new GoogleDriveApi();
const app: express.Application = express();
// Express related vars

const updateInterval = parseFloat(process.env.UPDATE_INTERVAL as string) || 24;
const maxLimit = 10000;
let db : DatabaseAdapter;

// INTERFACES
interface jsonRespInterface {
  data: any;
  [propName: string]: any;
}
// ./INTERFACES

let jsonRespStructure: jsonRespInterface = {
  data: [],
};

// Middlewares
app.use(cors());
app.use(compression());
if (process.env.NODE_ENV !== 'development') { // only use cache in production
  const cache = apicache.options({
    statusCodes: {
      exclude: [404, 403, 503],
      include: [200],
    },
  }).middleware;
  app.use(cache('6 hours'));
}

// HTTP Logger
app.use(morgan((tokens: any, req : express.Request, res : express.Response) => {
  const morganFormat = [`[${new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Shanghai',
  })}]`,
  `\x1b[35m${tokens.method(req, res)}\x1b[0m`,
  `\x1b[4m"${tokens.url(req, res)}\x1b[0m"`,
  `\x1b[36m${tokens.status(req, res)}\x1b[0m`,
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
  ];

  return morganFormat.join(' ');
}));
// Custom middleware
app.use(async (req, res, next) => {
  const dbLogger = await new DBLogger().init();
  // Clear data before every request
  jsonRespStructure = {
    data: [],
  };
  // add last_update to json response
  jsonRespStructure.last_update = await dbLogger.getLastUpdateDate();
  next();
});

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Auto update function
 * @return {Promise<void>}
 */
async function autoUpdate() {
  // @TODO @DOGGO this needs heavy refactoring
  let shouldSkip = false;
  console.log('\nAuto Update Initialized');
  console.log(`Interval hr: ${updateInterval}`);

  const data = await GDriveApi.downloadLatestFile();
  if (!data) throw Error('Error downloading latest files');
  if (data === downloadStatus.DOWNLOAD_SKIPPED) {
    shouldSkip = (process.env.DISABLE_SKIP_DATABASE_UPDATE as string).toLowerCase() !== 'true';
    console.log('Skipping download of files');
  } else {
    console.log('download status: ', data);
  }

  console.log('\nSKIP? ', shouldSkip);
  if (!shouldSkip) {
    const data2 = await db.updateDatabaseFromCSV();
    if (data2 === true) console.log('Database Updated Successfully');
    else throw Error('Something went wrong while updating database');
  }

  if ((process.env.DISABLE_TMP_DELETION as string).toLowerCase() !== 'true') {
    console.log('\nDeleting tmp folder...');
    deleteTmpFolder();
  } else {
    console.log('Skipping deletion of tmp folder.');
  }
}

(async () => {
  // Initialize Database
  db = await new DatabaseAdapter().init();
  // Initialize Google Auth Token
  await GDriveApi.getAuth();
  if (process.env.AUTO_UPDATE === 'true') {
    await autoUpdate();
    setInterval(await autoUpdate, ((1000 * 60) * 60) * updateInterval); // 1min -> 1 hr -> 24 hrs
  }
})();

router.get('/updateDatabase', async (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    await autoUpdate();
    res.json({ success: true });
  } else {
    res.send('You cannot manually update database in production.');
  }
});

router.get('/filter/:field/:value', async (req, res) => {
  jsonRespStructure.data = [];
  jsonRespStructure.WARNING = 'DEPRECATED please use /api/get?field=value instead';
  jsonRespStructure.result_count = jsonRespStructure.data.length;
  res.json(jsonRespStructure);
});

router.get('/get', async (req: express.Request, res: express.Response) => {
  const { month } = req.query;
  const { day } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || maxLimit;

  delete req.query.month;
  delete req.query.day;
  delete req.query.page;
  delete req.query.limit;

  const queries: any = {
    limit, month, day, page, maxLimit, filters: req.query,
  };

  try {
    const data = await db.get(queries);
    jsonRespStructure.data = data;
    const dbCount: number = await db.count('case_informations');
    const maxPage = Math.ceil(dbCount / limit);

    if (dbCount === 0) {
      jsonRespStructure.error = 'Error: There\'s no data found found.';
      return res.json(jsonRespStructure);
    }

    if (page > maxPage) {
      jsonRespStructure.error = `Error: page query can't be greater than max_page(${maxPage})`;
      return res.json(jsonRespStructure);
    }

    jsonRespStructure.pagination = {
      previous_page: page - 1,
      next_page: page + 1,
      limit,
      max_page: maxPage,
    };

    if (jsonRespStructure.pagination.previous_page <= 0) {
      delete jsonRespStructure.pagination.previous_page;
    }
    if (jsonRespStructure.pagination.next_page >= maxPage) {
      delete jsonRespStructure.pagination.next_page;
    }

    jsonRespStructure.result_count = data.length;
    res.json(jsonRespStructure);
  } catch (e) {
    jsonRespStructure.error = e.message;
    res.json(jsonRespStructure);
  }

  return null;
});

router.get('/timeline', async (req, res) => {
  try {
    const data = await db.getTimeline(req.query);
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  } catch (e) {
    jsonRespStructure.error = e.message;
    res.json(jsonRespStructure);
  }
});

router.get('/top-regions', async (req, res) => {
  try {
    const data = await db.getTopRegions();
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  } catch (e) {
    jsonRespStructure.error = e.message;
    res.json(jsonRespStructure);
  }
});

router.get('/summary', async (req, res) => {
  if (req.query.region === undefined && req.query.region_res !== undefined) {
    req.query.region = req.query.region_res;
  }

  const region: any = req.query.region || null;

  try {
    const data = await db.getSummary(region);
    ({
      result: jsonRespStructure.data,
      fatalityRate: jsonRespStructure.data.fatality_rate,
      recoveryRate: jsonRespStructure.data.recovery_rate,
    } = data);
    res.json(jsonRespStructure);
  } catch (e) {
    jsonRespStructure.error = e.message;
    res.json(jsonRespStructure);
  }
});

router.get('/facilities', async (req, res) => {
  try {
    const data = await db.getFacilities(req.query);
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  } catch (e) {
    jsonRespStructure.error = e.message;
    res.json(jsonRespStructure);
  }
});

router.get('/facilities/summary', async (req, res) => {
  try {
    const data = await db.getFacilitiesSummary(req.query);
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  } catch (e) {
    jsonRespStructure.error = e.message;
    res.json(jsonRespStructure);
  }
});

// API that lists values
router.get('/list-of/:field', async (req: express.Request, res: express.Response) => {
  if (!req.query.dataset) req.query.dataset = 'case_information';

  try {
    const data = await db.getListOf(req.params.field, req.query.dataset as string);
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  } catch (e) {
    jsonRespStructure.error = e.message;
    res.json(jsonRespStructure);
  }
});

app.use('/api', router); // Add prefix "/api" to routes above

app.use('/', (req, res) => res.redirect('https://documenter.getpostman.com/view/12463261/T1LV9jLU'));

export default app;
