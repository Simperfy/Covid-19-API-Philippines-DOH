/* eslint-disable max-len */
require('dotenv').config();

// GOOGLE DRIVE VARS
const googleDriveApi = require('./src/GoogleDriveApiClient');
const GoogleDriveApi = googleDriveApi.GoogleDriveApi;
const GDriveApi = new GoogleDriveApi();

// SERVER VARS
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Database vars
const database = require('./src/Database/Database');
const Database = database.Database;
const db = new Database();

// eslint-disable-next-line new-cap
const router = express.Router();

(
  // Initialize Google Auth Token
  async () => {
    await GDriveApi.getAuth();
    // await autoUpdate();
    // setInterval(await autoUpdate, (60000 * 60) * 24 ); // update every 24 hours
  }
)();

const jsonStructure = {
  'success': true,
  'result': [],
};

/**
 * Auto update function
 * @return {Promise<void>}
 */
async function autoUpdate() {
  console.log('Auto Update Initialized');
  await GDriveApi.downloadLatestFileFromArchives().then((data) => {
    console.log('Downloaded Latest Files - ' + data.latestFolderName);
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
async function verifyGoogleToken(res) {
  const auth = await GDriveApi.getAuth();
  if (auth.err) {
    console.log('GETTING NEW TOKEN');
    const url = GDriveApi.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: auth.scopes,
    });
    console.log('Redirecting TO: ' + url);

    res.redirect(url);
    return;
  }
  return true;
}

router.get('/updateDatabase', async (req, res) => {
  await autoUpdate().then((data) => {
    res.json({'success': true});
    console.log('Downloaded Latest Files ');
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

  await db.filter(field, value).then((result) => {
    jsonStructure.result = result;
    res.json(jsonStructure);
  }).catch((err) => {
    jsonStructure.success = false;
    jsonStructure.reason = err.message;
    res.json(jsonStructure);
  });
});

router.get('/get/:count?', async (req, res) => {
  await db.get(req.params.count).then((result) => {
    jsonStructure.result = result;
    res.json(jsonStructure);
  }).catch((err) => {
    jsonStructure.success = false;
    jsonStructure.reason = err.message;
    res.json(jsonStructure);
  });
});

app.use('/api', router); // Add prefix "/api" to routes above

app.get('/googleAuth', (req, res) => {
  try {
    GDriveApi.getAndStoreToken(req.query.code);
    res.redirect('/verified');
  } catch (error) {
    res.send('ERROR SAVING TOKEN: ' + error);
  }
});

app.get('/verified', (req, res) => res.send(
    '<html>Token Created! <a href="/">Go back to home</a><html>',
));

app.get('/', async (req, res) => {
  try {
    if (await verifyGoogleToken(res) === true) {
      res.send('Hello World!');
    }
  } catch (error) {
    res.send('ERROR Verifying Google Token');
  }
});


app.listen(port, () => console.log(`Started Server at http://localhost:${port}`)).on('close', () => {
  console.log('Terminating Database connection.');
  db.endConnection();
});
