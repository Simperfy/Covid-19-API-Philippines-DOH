/* eslint-disable max-len */
require('dotenv').config();
if (process.env.NODE_ENV !== 'development') {
  require('newrelic');
}
const cors = require('cors');
const apicache = require('apicache');
const morgan = require('morgan');

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
const port = process.env.PORT || 3000;

// Database vars
const MySQLDatabase = require('./src/Database/MySQLDatabase');
const DatabaseAdapter = require('./src/Database/DatabaseAdapter');

let db;
(
  async () => {
    db = await new DatabaseAdapter(new MySQLDatabase());
  }
)();


let forceRedirectToHome = false;
const jsonStructure = {
  'data': [],
};

// Middlewares
app.use(cors());
if (process.env.NODE_ENV !== 'development') { // only use cache in production
  app.use(cache('6 hours'));
}

// app.use(morgan(':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(morgan((tokens, req, res) => {
  return [
    tokens['remote-addr'](req, res), '-',
    tokens['remote-user'](req, res),
    '[' + new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Shanghai',
    }) + ']',
    tokens.method(req, res), '',
    `"${tokens.url(req, res)}"`,
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
  ].join(' ');
}));

// Custom middleware
app.use(function(req, res, next) {
  if (forceRedirectToHome && req.url !== '/') {
    forceRedirectToHome = false;
    console.log('Force redirect to home');
    return res.redirect('/');
  }

  // Clear data before every request
  jsonStructure.data = [];
  delete jsonStructure.error;
  delete jsonStructure.result_count;
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
        setInterval(await autoUpdate, ((1000 * 60) * 60) * 24 ); // 1min -> 1 hr -> 24 hrs
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
  console.log('\nAuto Update Initialized');
  await GDriveApi.downloadLatestFile().then(() => {
    console.log('Downloaded Latest Files');
  }).catch((err) => {
    console.log('Error Downloading Latest Files: ' + err);
  });

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

router.get('/updateDatabase', async (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    await autoUpdate().then(() => {
      res.json({'success': true});
      console.log('Downloaded Latest Files');
    }).catch((err) => {
      res.json({'success': false});
      console.log('Error Downloading Latest Files: ' + err);
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

router.get('/get/:count?', async (req, res) => {
  const month = req.query.month;
  const day = req.query.day;
  await db. get({count: req.params.count, month: month, day: day}).then((data) => {
    jsonStructure.data = data;
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

app.listen(port, () => console.log(`\nStarted Server at port ${port}`)).on('close', () => {
  console.log('Terminating Database connection.');
  db.endConnection();
});
