/* eslint-disable max-len */
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const apicache = require('apicache');
// Swagger api docs
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
// GOOGLE DRIVE VARS
const GoogleDriveApi = require('./src/GoogleDriveApiClient').GoogleDriveApi;
const GDriveApi = new GoogleDriveApi();
// SERVER VARS
const express = require('express');
const app = express();
// Database vars
const DatabaseAdapter = require('./src/Database/DatabaseAdapter');
// Database Logger
const DBLogger = require('./src/DBLogger');
// Enums
const downloadStatus = require('./src/utils/enums').DOWNLOAD_STATUS;
// Express related vars
const updateInterval = parseFloat(process.env.UPDATE_INTERVAL) || 24;
const maxLimit = 10000;
let db;
let jsonRespStructure = {
  'data': [],
};

// swaggerUI.setup Options
const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Covid-19 Philippines API DOH',
};
// swaggerJsDoc Options
const swaggerOptions = {
  swaggerDefinition: {
    'openapi': '3.0.0',
    'info': {
      title: 'COVID-19 API Philippines DOH',
      description: 'COVID-19 API Philippines from DOH DATA DROP',
      contact: {
        'name': 'Github',
        'url': 'https://github.com/Simperfy/Covid-19-API-Philippines-DOH',
      },
      version: '0.8.0',
      servers: [
        {
          'url': 'https://covid19-api-philippines.herokuapp.com/',
          'description': 'Production server',
        },
      ],
    },
  },
  apis: ['app.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

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
app.use(morgan((tokens, req, res) => { // HTTP Logger
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
  db = await new DatabaseAdapter();
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
      shouldSkip = process.env.FORCE_NOT_SKIP.toLowerCase() !== 'true';
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

/**
 * @swagger
 * /api/filter/{field}/{value}:
 *  get:
 *    tags: [Case Informations]
 *    deprecated: true
 *    description: DEPRECATED, use /api/get?field=value/ instead
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: field
 *        description: field to filter
 *        in: path
 *        required: true
 *        type: string
 *      - name: value
 *        description: value to filter
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *        description: A Successful response
 *
 */
router.get('/filter/:field/:value', async (req, res) => {
  let field = req.params.field.trim();
  let value = req.params.value.trim();

  if (field === 'age') value = parseInt(value);
  if (field === 'region') field = 'region_res';

  await db.filter(field, value).then((data) => {
    jsonRespStructure.data = data;
    jsonRespStructure.WARNING = 'DEPRECATED please use /api/get?field=value instead';
    jsonRespStructure.result_count = data.length;
    res.json(jsonRespStructure);
  }).catch((err) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

/**
 * @swagger
 * /api/get:
 *  get:
 *    tags: [Case Informations]
 *    description: Use to fetch all case informations
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: page
 *        description: page for entries
 *        in: query
 *        required: false
 *        type: integer
 *        example: 1
 *      - name: limit
 *        description: limit for entries
 *        in: query
 *        required: false
 *        type: integer
 *        example: 10
 *      - name: month
 *        description: returns record with this month
 *        in: query
 *        required: false
 *        type: string
 *        example: '03'
 *      - name: day
 *        description: returns record with this day
 *        in: query
 *        required: false
 *        type: string
 *        example: '30'
 *    responses:
 *      '200':
 *        description: A Successful response
 *
 */
router.get('/get', async (req, res) => {
  const month = req.query.month;
  const day = req.query.day;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || maxLimit;

  delete req.query.month;
  delete req.query.day;
  delete req.query.page;
  delete req.query.limit;

  const queries = {limit: limit, month: month, day: day, page: page, maxLimit: maxLimit, filters: req.query};

  await db.get(queries).then(async (data) => {
    jsonRespStructure.data = data;
    const dbCount = await db.count('case_informations');
    const maxPage = Math.ceil(dbCount / limit);

    if (dbCount === 0) {
      jsonRespStructure.error = `Error: There's no data found found.`;
      return res.json(jsonRespStructure);
    }

    if (page > maxPage) {
      jsonRespStructure.error = `Error: page query can\'t be greater than max_page(${maxPage})`;
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
  }).catch((err) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

/**
 * @swagger
 * /api/timeline:
 *  get:
 *    tags: [Case Informations]
 *    description: Use to fetch cases timeline
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: A Successful response
 *
 */
router.get('/timeline', async (req, res) => {
  await db.getTimeline().then((data) => {
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  }).catch((err) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

/**
 * @swagger
 * /api/top-regions:
 *  get:
 *    tags: [Case Informations]
 *    description: Use to fetch regions by ranking of highest covid cases
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: A Successful response
 *
 */
router.get('/top-regions', async (req, res) => {
  await db.getTopRegions().then((data) => {
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  }).catch((err) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

/**
 * @swagger
 * /api/summary:
 *  get:
 *    tags: [Case Informations]
 *    description: Use to fetch summary of covid cases
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: region
 *        description: returns summary of covid cases of that region
 *        in: query
 *        required: false
 *        type: string
 *        example: 'ncr'
 *    responses:
 *      '200':
 *        description: A Successful response
 *
 */
router.get('/summary', async (req, res) => {
  if (req.query.region === undefined && req.query.region_res !== undefined) {
    req.query.region = req.query.region_res;
  }
  const region = req.query.region || null;

  await db.getSummary(region).then((data) => {
    ({result: jsonRespStructure.data,
      fatalityRate: jsonRespStructure.data.fatality_rate,
      recoveryRate: jsonRespStructure.data.recovery_rate} = data);

    res.json(jsonRespStructure);
  }).catch((err) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

/**
 * @swagger
 * /api/facilities:
 *  get:
 *    tags: [Facilities]
 *    description: Use to fetch facilities/hospital data
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: A Successful response
 *
 */
router.get('/facilities', async (req, res) => {
  await db.getFacilities(req.query).then((data) => {
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  }).catch((err) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

app.use('/api', router); // Add prefix "/api" to routes above

app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocs, options));

module.exports = app;
