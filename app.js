/* eslint-disable max-len */
require('dotenv').config();
const cors = require('cors');
const apicache = require('apicache');
const morgan = require('morgan');
const compression = require('compression');

const cache = apicache.options({
  statusCodes: {
    exclude: [404, 403, 503],
    include: [200],
  },
}).middleware;
// Disable console.log on production
/* if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
}*/

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

let db;
(
  async () => {
    db = await new DatabaseAdapter(new MySQLDatabase());
  }
)();

const updateInterval = parseFloat(process.env.UPDATE_INTERVAL) || 24;
const maxLimit = 10000;
let forceRedirectToHome = false;
let jsonStructure = {
  'data': [],
};

// Middlewares
app.use(cors());
app.use(compression());
if (process.env.NODE_ENV !== 'development') { // only use cache in production
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
  jsonStructure = {
    'data': [],
  };
  jsonStructure.last_update = await dbLogger.getLastUpdateDate();
  next();
});

// eslint-disable-next-line new-cap
const router = express.Router();


(
  // Initialize Google Auth Token
  async () => {
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
  }
)();

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
    jsonStructure.data = data;
    res.json(jsonStructure);
  }).catch((err) => {
    jsonStructure.error = err.message;
    res.json(jsonStructure);
  });
});

router.get('/get', async (req, res) => {
  const month = req.query.month;
  const day = req.query.day;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || maxLimit;

  await db.get({limit: limit, month: month, day: day, page: page, maxLimit: maxLimit}).then(async (data) => {
    jsonStructure.data = data;
    const maxPage = Math.ceil(await db.count() / limit);

    if (page > maxPage) {
      jsonStructure.error = `Error: page query can\'t be greater than max_page(${maxPage})`;
      return res.json(jsonStructure);
    }

    jsonStructure.pagination = {
      'previous_page': page - 1,
      'next_page': page + 1,
      'limit': limit,
      'max_page': maxPage,
    };

    if (jsonStructure.pagination.previous_page <= 0) {
      delete jsonStructure.pagination.previous_page;
    }

    if (jsonStructure.pagination.next_page >= maxPage) {
      delete jsonStructure.pagination.next_page;
    }

    jsonStructure.result_count = data.length;
    res.json(jsonStructure);
  }).catch((err) => {
    jsonStructure.error = err.message;
    res.json(jsonStructure);
  });
});

router.get('/timeline', async (req, res) => {
  await db.getTimeline().then((data) => {
    jsonStructure.data = data;
    res.json(jsonStructure);
  }).catch((err) => {
    jsonStructure.error = err.message;
    res.json(jsonStructure);
  });
});

router.get('/summary', async (req, res) => {
  const region = req.query.region || null;

  await db.getSummary(region).then((data) => {
    jsonStructure.data = data[0];
    const fatalityRate = data[0].deaths / data[0].total;
    const recoveryRate = data[0].recoveries / data[0].total;
    jsonStructure.data.fatality_rate = (fatalityRate * 100).toFixed(2);
    jsonStructure.data.recovery_rate = (recoveryRate * 100).toFixed(2);
    res.json(jsonStructure);
  }).catch((err) => {
    jsonStructure.error = err.message;
    res.json(jsonStructure);
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
