require('dotenv').config();

// GOOGLE DRIVE VARS
const googleDriveApi = require('./GoogleDriveApiClient');
const GoogleDriveApi = googleDriveApi.GoogleDriveApi;

// SERVER VARS
const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

// Database vars
const database = require('./Database/Database');
const Database = database.Database;

// const csvDatabase = require('./CSVDatabase');
// const CSVDatabase = csvDatabase.CSVDatabase;

const GDriveApi = new GoogleDriveApi();
// const csvD = new CSVDatabase();
// eslint-disable-next-line new-cap
const router = express.Router();

const db = new Database();
// (async () => {
//   // console.log(await db.count({field: 'age', value: '18'}));
//   console.log(await db.get());
// })();
// return;

/**
 * verify token.json exists on application start
 * @param {express.RequestParamHandler} res
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

router.get('/downloadLatestFiles', async (req, res) => {
  GDriveApi.downloadLatestFiles().then((data) => {
    res.send('Downloaded Latest Files - ' + data);
  }).catch((err) => {
    res.send('Error Downloading Latest Files: ' + err);
  });
});

router.get('/filter/:field/:value', async (req, res) => {
  const field = req.params.field.trim();
  let value = req.params.value.trim();

  if (field == 'age') {
    value = parseInt(value);
  }

  res.json(await db.filter(field, value));
});

router.get('/get/:count?', async (req, res) => {
  res.json(await db.get(req.params.count));
});

app.use('/api', router); // Add prefix "/api" to routes above

app.get('/googleAuth', (req, res) => {
  try {
    GDriveApi.getAndStoreTokenCode(req.query.code);
    res.redirect('/verified');
  } catch (error) {
    res.send('ERROR SAVING TOKEN: ' + error);
  }
});

app.get('/verified', (req, res) => res.send(
    'Token Created! <html><a href="/">Go back to home</a><html>',
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
  console.log('Terminating Datebase connection.');
  db.endConnection();
});
