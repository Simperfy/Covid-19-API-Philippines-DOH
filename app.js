/* eslint-disable max-len */
require('dotenv').config();

// Disable console.log on production
if (process.env.NODE_ENV === 'development') {
  console.log = () => {};
}

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
      // await autoUpdate();
      // setInterval(await autoUpdate, (60000 * 60) * 24 ); // update every 24 hours
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
 * verify token.json exists on application start
 * @param {express.req} res
 */
/* async function verifyGoogleToken(res) {
  let result;
  await GDriveApi.getAuth().then(() => {
    result = true;
  }).catch((authErr) => {
    console.log('GETTING NEW TOKEN');
    const url = GDriveApi.auth.generateAuthUrl({
      access_type: 'offline',
      scope: authErr.scopes,
    });
    console.log('Redirecting TO: ' + url);

    res.redirect(url);
  });
  return result;
}*/

/**
 * Clear data before every request
 */
app.use(function(req, res, next) {
  if (forceRedirectToHome && req.url !== '/') {
    forceRedirectToHome = false;
    console.log('Force redirect to home');
    return res.redirect('/');
  }
  jsonStructure.data = [];
  delete jsonStructure.error;
  next();
});

router.get('/updateDatabase', async (req, res) => {
  await autoUpdate().then((data) => {
    res.json({'success': true});
    console.log('Downloaded Latest Files');
  }).catch((err) => {
    res.json({'success': false});
    console.log('Error Downloading Latest Files: ' + err);
  });
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
  await db.get(req.params.count).then((data) => {
    jsonStructure.data = data;
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

/* app.get('/googleAuth', (req, res) => {
  try {
    GDriveApi.getAndStoreToken(req.query.code);
    res.redirect('/verified');
  } catch (error) {
    res.send('ERROR SAVING TOKEN: ' + error);
  }
});*/

/* app.get('/verified', (req, res) => res.send(
    '<html>Token Created! <a href="/">Go back to home</a><html>',
));*/

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
