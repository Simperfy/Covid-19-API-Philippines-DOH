/* eslint-disable max-len */
require('dotenv').config();
const cors = require('cors');
const apicache = require('apicache');

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
const databaseAdapter = require('./src/Database/DatabaseAdapter');
const DatabaseAdapter = databaseAdapter.DatabaseAdapter;
const db = new DatabaseAdapter();

// Middlewares
app.use(cors());
app.use(cache('6 hours'));

// eslint-disable-next-line new-cap
const router = express.Router();

let forceRedirectToHome = false;
const jsonStructure = {
  'data': [],
};
(
  // Initialize Google Auth Token
  async () => {
    await GDriveApi.getAuth().then(async () => {
      if (process.env.NODE_ENV === 'production') {
        await autoUpdate();
        setInterval(await autoUpdate, (60000 * 60) * 24 );
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

/**
 * Custom middleware
 */
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
    res.send('Unable to manually update database in production.');
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

router.get('/summary', async (req, res) => {
  await db.getSummary().then((data) => {
    jsonStructure.data = data[0];
    res.json(jsonStructure);
  }).catch((err) => {
    jsonStructure.error = err.message;
    res.json(jsonStructure);
  });
});

app.use('/api', router); // Add prefix "/api" to routes above

app.get('/', async (req, res) => {
  try {
    res.send('Hello World!');
  } catch (err) {
    res.send('ERROR Verifying Google Token: \n' + JSON.stringify(err));
  }
});

app.listen(port, () => console.log(`\nStarted Server at port ${port}`)).on('close', () => {
  console.log('Terminating Database connection.');
  db.endConnection();
});
