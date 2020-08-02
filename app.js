/* eslint-disable max-len */
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const apicache = require('apicache');
// GOOGLE DRIVE VARS
const googleDriveApi = require('./src/GoogleDriveApiClient');
const GoogleDriveApi = googleDriveApi.GoogleDriveApi;
const GDriveApi = new GoogleDriveApi();
// SERVER VARS
const express = require('express');
const app = express();
// Database vars
const MySQLDatabase = require('./src/Database/MySQLDatabase');
const DatabaseAdapter = require('./src/Database/DatabaseAdapter');
// Database Logger
const DBLogger = require('./src/DBLogger');
// Express related vars
const updateInterval = parseFloat(process.env.UPDATE_INTERVAL) || 24;
const maxLimit = 10000;
let db;
let forceRedirectToHome = false;
let jsonRespStructure = {
  'data': [],
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
app.use(morgan((tokens, req, res) => {
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
  if (forceRedirectToHome && req.url !== '/') {
    forceRedirectToHome = false;
    console.log('Force redirect to home');
    return res.redirect('/');
  }

  const dbLogger = await new DBLogger();

  // Clear data before every request
  jsonRespStructure = {
    'data': [],
  };
  jsonRespStructure.last_update = await dbLogger.getLastUpdateDate();
  next();
});

// eslint-disable-next-line new-cap
const router = express.Router();

(async () => {
  // Initialize Database
  db = await new DatabaseAdapter(new MySQLDatabase());
  // Initialize Google Auth Token
  await GDriveApi.getAuth().then(async () => {
    if (process.env.NODE_ENV === 'production') {
      await autoUpdate();
      setInterval(await autoUpdate, ( (1000 * 60) * 60) * updateInterval ); // 1min -> 1 hr -> 24 hrs
    }
  }).catch((err) => {
    forceRedirectToHome = true;
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
    if (data === 'SKIP') {
      shouldSkip = true;
      console.log('Skipping download of files');
    } else {
      console.log('data: ', data);
    }
  }).catch((err) => {
    console.log('Error Downloading Latest Files: ' + err);
  });

  console.log('SKIP ', shouldSkip);
  if (!shouldSkip) {
    await db.updateDatabaseFromCSV().then((data) => {
      if (data === true) {
        console.log('Database Updated Successfully');
      } else {
        console.log('Something went wrong while updating database');
      }
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

router.get('/filter/:field/:value', async (req, res) => {
  const field = req.params.field.trim();
  let value = req.params.value.trim();

  if (field === 'age') {
    value = parseInt(value);
  }

  await db.filter(field, value).then((data) => {
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  }).catch((err) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

router.get('/get', async (req, res) => {
  const month = req.query.month;
  const day = req.query.day;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || maxLimit;

  await db.get({limit: limit, month: month, day: day, page: page, maxLimit: maxLimit}).then(async (data) => {
    jsonRespStructure.data = data;
    const maxPage = Math.ceil(await db.count() / limit);

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

router.get('/timeline', async (req, res) => {
  await db.getTimeline().then((data) => {
    jsonRespStructure.data = data;
    res.json(jsonRespStructure);
  }).catch((err) => {
    jsonRespStructure.error = err.message;
    res.json(jsonRespStructure);
  });
});

router.get('/summary', async (req, res) => {
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

app.use('/api', router); // Add prefix "/api" to routes above

app.get('/', async (req, res) => {
  try {
    res.send('<html>Endpoints and documentation are available <a href="https://github.com/Simperfy/Covid-19-API-Philippines-DOH#-endpoints">here</a></html>');
  } catch (err) {
    res.send('ERROR Verifying Google Token: \n' + JSON.stringify(err));
  }
});

module.exports = app;
