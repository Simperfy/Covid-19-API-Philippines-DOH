/* eslint-disable max-len */
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import apicache from 'apicache';
// Swagger api docs
// const swaggerUI = require('swagger-ui-express');
// const openApiJson = require('./openapi.json');
// GOOGLE DRIVE VARS
import GoogleDriveApi from './GoogleDriveApiClient';
const GDriveApi = new GoogleDriveApi();
// SERVER VARS
import express from 'express';
const app: express.Application = express();
// Database vars
import DatabaseAdapter from './Database/DatabaseAdapter';
// Database Logger
import DBLogger from './DBLogger';
// Enums
import {DOWNLOAD_STATUS as downloadStatus} from './utils/enums';
// helpers
import {deleteTmpFolder} from './utils/helper';
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
  'data': [],
};

// swaggerUI.setup Options
// const options = {
//   customCss: '.swagger-ui .topbar { display: none }',
//   customSiteTitle: 'Covid-19 Philippines API DOH',
// };

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
app.use(morgan((tokens: any, req : express.Request, res : express.Response) => { // HTTP Logger
  return [
    '[' + new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Shanghai',
    }) + ']',
    `\x1b[35m${tokens.method(req, res)}\x1b[0m`,
    `\x1b[4m"${tokens.url(req, res)}\x1b[0m"`,
    `\x1b[36m${tokens.status(req, res)}\x1b[0m`,
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
  ].join(' ');
}));
// Custom middleware
app.use(async (req, res, next) => {
  const dbLogger = await new DBLogger();
  // Clear data before every request
  jsonRespStructure = {
    'data': [],
  };
  // add last_update to json response
  jsonRespStructure.last_update = await dbLogger.getLastUpdateDate();
  next();
});

// eslint-disable-next-line new-cap
const router = express.Router();

(async () => {
  // Initialize Database
  db = await new DatabaseAdapter().init();
  // Initialize Google Auth Token
  await GDriveApi.getAuth().then(async () => {
    if (process.env.NODE_ENV === 'production') {
      await autoUpdate();
      setInterval(await autoUpdate, ( (1000 * 60) * 60) * updateInterval ); // 1min -> 1 hr -> 24 hrs
    }
  }).catch((err) => {
    if (err.err) {
      console.log('\n' + err.err);
    } else {
      console.log('\n' + err);
    }
  });
})();

/**
 * Auto update function
 * @return {Promise<void>}
 */
async function autoUpdate() {
  // @TODO @DOGGO this needs heavy refactoring
  let shouldSkip = false;
  console.log('\nAuto Update Initialized');
  console.log('Interval hr: ' + updateInterval);
  await GDriveApi.downloadLatestFile().then((data) => {
    if (data === downloadStatus.DOWNLOAD_SKIPPED) {
      shouldSkip = (process.env.DISABLE_SKIP_DATABASE_UPDATE as string).toLowerCase() !== 'true';
      console.log('Skipping download of files');
    } else {
      console.log('download status: ', data);
    }
  }).catch((err) => {
    console.log('Error Downloading Latest Files: ' + err);
  });

  console.log('\nSKIP? ', shouldSkip);
  if (!shouldSkip) {
    await db.updateDatabaseFromCSV().then((data) => {
      if (data === true) console.log('Database Updated Successfully');
      else console.log('Something went wrong while updating database');
    }).catch((err) => {
      console.log('Error Updating Database: ' + err);
    });
  }

  if ((process.env.DISABLE_TMP_DELETION as string).toLowerCase() !== 'true') {
    console.log('\nDeleting tmp folder...');
    deleteTmpFolder();
  } else {
    console.log('Skipping deletion of tmp folder.');
  }
}

router.get('/updateDatabase', async (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    await autoUpdate().then(() => {
      res.json({'success': true});
    }).catch((err) => {
      res.json({'success': false});
    });
  } else {
    res.send('You cannot manually update database in production.');
  }
});

router.get('/filter/:field/:value', async (req, res) => {
  jsonRespStructure.data = [];
  jsonRespStructure.WARNING = 'DEPRECATED please use /api/get?field=value instead';
  jsonRespStructure.result_count = jsonRespStructure.data.length;
  res.json(jsonRespStructure);
  /* let field = req.params.field.trim();
  let value = req.params.value.trim();

  if (field === 'age') value = parseInt(value);
  if (field === 'region') {
    field = 'region_res';
    value = value.toLowerCase();
  }

  await db.filter(field, value).then((data) => {
    jsonRespStructure.data = data;
    jsonRespStructure.WARNING = 'DEPRECATED please use /api/get?field=value instead';
    jsonRespStructure.result_count = data.length;
    res.json(jsonRespStructure);
  }).catch((err) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });*/
});

router.get('/get', async (req: express.Request, res: express.Response) => {
  const month = req.query.month;
  const day = req.query.day;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || maxLimit;

  delete req.query.month;
  delete req.query.day;
  delete req.query.page;
  delete req.query.limit;

  const queries: any = {limit: limit, month: month, day: day, page: page, maxLimit: maxLimit, filters: req.query};

  await db.get(queries).then(async (data: any) => {
    jsonRespStructure.data = data;
    const dbCount = await db.count('case_informations');
    const maxPage = Math.ceil(dbCount / limit);

    if (dbCount === 0) {
      jsonRespStructure.error = `Error: There's no data found found.`;
      return res.json(jsonRespStructure);
    }

    if (page > maxPage) {
      jsonRespStructure.error = `Error: page query can't be greater than max_page(${maxPage})`;
      return res.json(jsonRespStructure);
    }

    jsonRespStructure.pagination = {
      'previous_page': page - 1,
      'next_page': page + 1,
      'limit': limit,
      'max_page': maxPage,
    };

    if (jsonRespStructure.pagination.previous_page <= 0) {
      delete jsonRespStructure.pagination.previous_page;
    }
    if (jsonRespStructure.pagination.next_page >= maxPage) {
      delete jsonRespStructure.pagination.next_page;
    }

    jsonRespStructure.result_count = data.length;
    res.json(jsonRespStructure);
  }).catch((err: Error) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

router.get('/timeline', async (req, res) => {
  await db.getTimeline(req.query).then((data: any) => {
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  }).catch((err: Error) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

router.get('/top-regions', async (req, res) => {
  await db.getTopRegions().then((data: any) => {
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  }).catch((err: Error) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

router.get('/summary', async (req, res) => {
  if (req.query.region === undefined && req.query.region_res !== undefined) {
    req.query.region = req.query.region_res;
  }

  const region: any = req.query.region || null;

  await db.getSummary(region).then((data : any) => {
    ({result: jsonRespStructure.data,
      fatalityRate: jsonRespStructure.data.fatality_rate,
      recoveryRate: jsonRespStructure.data.recovery_rate} = data);

    res.json(jsonRespStructure);
  }).catch((err: Error) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

router.get('/facilities', async (req, res) => {
  await db.getFacilities(req.query).then((data: any) => {
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  }).catch((err: Error) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

router.get('/facilities/summary', async (req, res) => {
  await db.getFacilitiesSummary(req.query).then((data: any) => {
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  }).catch((err: Error) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

// API that lists values
router.get('/list-of/:field', async (req: express.Request, res: express.Response) => {
  if (!req.query.dataset) req.query.dataset = 'case_information';

  await db.getListOf(req.params.field, req.query.dataset as string).then((data: any) => {
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  }).catch((err: Error) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

app.use('/api', router); // Add prefix "/api" to routes above

// app.use('/', swaggerUI.serve, swaggerUI.setup(openApiJson, options));

app.use('/', (req, res) => res.redirect('https://documenter.getpostman.com/view/12463261/T1LV9jLU'));

export default app;
