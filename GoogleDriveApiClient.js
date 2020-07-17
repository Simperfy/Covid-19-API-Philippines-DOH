/* eslint-disable max-len */
/* eslint-disable no-throw-literal */
/* eslint-disable require-jsdoc */

// REFERENCES:
// GOOGLE DRIVE API V3 DOCS https://developers.google.com/drive/api/v3/
// Metadata of file https://developers.google.com/drive/api/v3/reference/files
const fs = require('fs');
const {google} = require('googleapis');
const path = require('path');
const DOH_DATA_DROP_FOLDER_ID = '1w_O-vweBFbqCgzgmCpux2F0HVB4P6ni2';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

class GoogleDriveApi {
  // make this a singleton
  constructor() {
    if (process.env.NODE_ENV == 'development') {
      console.log('checking credentials.json in ' + CREDENTIALS_PATH);
      if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw 'MISSING credentials.json, Get one at https://developers.google.com/drive/api/v3/quickstart/go';
      }
    } else {
      console.log('skipping verification of credentials.json');
    }

    if (!GoogleDriveApi.instance) {
      GoogleDriveApi.instance = this;
    }
    return GoogleDriveApi.instance;
  }

  /**
     * Entry point for the class
     * @return {google.auth.OAuth2} returns auth api from google drive api
    */
  async getAuth() {
    console.log('Authorizing');
    return new Promise((resolve) => {
      if (!fs.existsSync(CREDENTIALS_PATH)) {
        // load client secrets from .env file
        console.log('Crafting new json');
        const credentials = {
          'web': {
            'client_id': '',
            'project_id': '',
            'auth_uri': '',
            'token_uri': '',
            'auth_provider_x509_cert_url': '',
            'client_secret': '',
            'redirect_uris': [],
            'javascript_origins': [],
          },
        };
        const json = credentials.web;
        console.log('Replacing credentials.json with environment values');
        if (process.env.CLIENT_ID) {
          json.client_id = process.env.CLIENT_ID;
        }
        if (process.env.PROJECT_ID) {
          json.project_id = process.env.PROJECT_ID;
        }
        if (process.env.AUTH_URI) {
          json.auth_uri = process.env.AUTH_URI;
        }
        if (process.env.TOKEN_URI) {
          json.token_uri = process.env.TOKEN_URI;
        }
        if (process.env.AUTH_PROVIDER_X509_CERT_URL) {
          json.auth_provider_x509_cert_url = process.env.AUTH_PROVIDER_X509_CERT_URL;
        }
        if (process.env.CLIENT_SECRET) {
          json.client_secret = process.env.CLIENT_SECRET;
        }
        if (process.env.REDIRECT_URIS1) {
          json.redirect_uris[0] = process.env.REDIRECT_URIS1;
        }
        if (process.env.REDIRECT_URIS2) {
          json.redirect_uris[1] = process.env.REDIRECT_URIS2;
        }
        if (process.env.JAVASCRIPT_ORIGINS1) {
          json.javascript_origins[0] = process.env.JAVASCRIPT_ORIGINS1;
        }
        if (process.env.JAVASCRIPT_ORIGINS2) {
          json.javascript_origins[1] = process.env.JAVASCRIPT_ORIGINS2;
        }
        // console.log(credentials);
        resolve(this.authorize(credentials));
      } else {
        // Load client secrets from a local file.
        fs.readFile(CREDENTIALS_PATH, (err, content) => {
          if (err) return console.log('Error loading client secret file:', err);
          // Authorize a client with credentials, then call the Google Drive API.
          resolve(this.authorize(JSON.parse(content)));
        });
      }
    });
  }

  /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
  async authorize(credentials) {
    // console.log(credentials);
    return new Promise((resolve) => {
      const {client_secret: clientSecret, client_id: clientId, redirect_uris: redirectUris} = credentials.web;
      // console.log(credentials.web);
      console.log(redirectUris[process.env.NODE_ENV == 'production' ? 1 : 0]);
      this.oAuth2Client = new google.auth.OAuth2(
          clientId, clientSecret, redirectUris[process.env.NODE_ENV == 'production' ? 1 : 0]);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          const obj = {
            'err': 'no access token: ' + err,
            'scopes': SCOPES,
          };
          return resolve(obj);
        }
        this.oAuth2Client.setCredentials(JSON.parse(token));
        resolve(this.oAuth2Client);
      });
    });
  }

  /**
     *
     * @param {String} code Code returned by Google URL Callback
     */
  getAndStoreTokenCode(code) {
    this.oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      this.oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) throw err;
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  }

  /**
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
  listFiles() {
    const auth = this.oAuth2Client;
    // console.log(auth);
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) {
        console.log('\nFiles:');
        files.map((file) => {
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log('No files found.');
      }
    });
  }

  /**
     * @param {String} query Search query
     * @param {int} pageSize max number of result
     * @return {Promise} contains files object with name and id
     */
  searchFiles(query, pageSize = 10) {
    return new Promise((resolve) => {
      const auth = this.oAuth2Client;
      const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        q: query,
        pageSize: pageSize,
        fields: 'nextPageToken, files(id, name)',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
          console.log('\nSearched Files:');
          resolve(files);
          files.map((file) => {
            console.log(`${file.name} (${file.id})`);
          });
        } else {
          console.log('No files found.');
        }
      });
    });
  }

  /**
     * @param {Object} fileObj File Object containing ID and name of the file
     * @param {String} name Name of the file that will be downloaded
     * @return {String} filePath to the downloaded file
     */
  async downloadFile(fileObj, name = 'Data.csv') {
    console.log('DOWNLOADING LATEST FILE: ' + fileObj.name);

    const auth = this.oAuth2Client;
    const drive = google.drive({version: 'v3', auth});
    const res = await drive.files
        .get({fileId: fileObj.id, alt: 'media'}, {responseType: 'stream'}).catch((err) => console.log(err));
    return fs.promises.mkdir(path.dirname('tmp/Data.csv'), {recursive: true}).then((data) => {
      // const filePath = path.join(os.tmpdir(), uuid.v4());
      // const filePath = path.relative(process.cwd(), `tmp/${name}`);
      const filePath = path.join(__dirname, `tmp/${name}`);

      console.log(`writing to ${filePath}`);
      const dest = fs.createWriteStream(filePath);
      let progress = 0;

      res.data
          .on('end', () => {
            console.log('\nDone downloading file. ' + this.latestFolderName);
            return filePath;
          })
          .on('error', (err) => {
            console.error('Error downloading file.');
            throw err;
          })
          .on('data', (d) => {
            progress += d.length;
            if (process.stdout.isTTY) {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`Downloaded ${progress} bytes`);
            }
          })
          .pipe(dest);

      dest.on('finish', () => {
        dest.close();
      });
    });
  }

  /**
     * @return {JSON} a json containing name and id of folders in the root folder
     */
  async getFilesInRootFolder() {
    return new Promise((resolve)=> {
      const auth = this.oAuth2Client;
      const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        q: `'${DOH_DATA_DROP_FOLDER_ID}' in parents`,
        fields: 'nextPageToken, files(id, name)',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
          console.log('\nFiles in root folder:');
          files.map((file) => {
            console.log(`${file.name} ${file.id}`);
          });

          resolve(files);
        } else {
          console.log('No files found.');
        }
      });
    });
  }

  /**
     * @return {String} ID of the folder this month
     */
  async getGFolderIDThisMonth() {
    const date = new Date();
    const month = (date.getMonth()) + 1;
    const searchString = '(0' + month + '/20)';

    const folders = await this.getFilesInRootFolder();

    console.log(`\nFiltering "${searchString}": `);
    const res = folders.filter((file) => {
      console.log((-1 != (file.name.search(searchString))) + ' : ' + file.name);
      return (-1 != (file.name.search(searchString)));
    });

    if (res.length == 1) {
      return res[0].id;
    }

    throw '[googleDriveApiClient.js] Folder this month couldn\'t be found';
  }

  /**
     * We get the latest folder by ordering the result by name in descending order
     * therefore the first element in result is the latest
     * we cannot use date modified/create date because DOH create/modify these folders from time to time.
     * @return {Object} Contains ID and Name of the latest folder inside this month's folder
     */
  async getLatestGFolderObject() {
    const id = await this.getGFolderIDThisMonth();
    console.log('\nThis month folder id: ' + id);

    const auth = this.oAuth2Client;
    const drive = google.drive({version: 'v3', auth});

    return new Promise((resolve) => {
      drive.files.list({
        q: `'${id}' in parents`,
        orderBy: 'name desc',
        fields: 'nextPageToken, files(id, name)',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
          console.log(`\nFiles inside this month's folder:`);
          files.map((file) => {
            console.log(`${file.name} ${file.id}`);
          });
          resolve(files[0]);
        } else {
          console.log('No files found.');
          throw '[googleDriveApiClient.js] No files found in this month\'s folder';
        }
      });
    });
  }

  /**
     * @return {Promise} Object with name and id of the items inside latest folder
     */
  async getLatestFolderContentsObject() {
    const latestFolder = await this.getLatestGFolderObject();
    const id = latestFolder.id;
    this.latestFolderName = latestFolder.name;
    console.log('\nLatest folder id: ' + id);

    const auth = this.oAuth2Client;
    const drive = google.drive({version: 'v3', auth});
    const searchString = 'Case Information.csv';

    return new Promise((resolve) => {
      drive.files.list({
        q: `'${id}' in parents`,
        orderBy: 'name',
        fields: 'nextPageToken, files(id, name)',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
          console.log(`\nFiltering "${searchString}":`);
          const res = files.filter((file) => {
            console.log((-1 != (file.name.search(searchString))) + ' : ' + file.name);
            return (-1 != (file.name.search(searchString)));
          });

          if (res.length == 1) {
            resolve(res[0]);
          } else {
            throw '[googleDriveApiClient.js] No results from search. Search String = ' + searchString;
          }
        } else {
          console.log('No files found.');
          throw '[googleDriveApiClient.js] No files found in latest folder';
        }
      });
    });
  }

  /**
     * @return {String} name of the latest downloaded csv
     */
  async downloadLatestFiles() {
    const latestFolderObject = await this.getLatestFolderContentsObject();
    await this.downloadFile(latestFolderObject, 'Data.csv');
    return latestFolderObject.name;
  }
}

exports.GoogleDriveApi = GoogleDriveApi;

// download Case Information latest csv
// async function test() {
//     let G = new GoogleDriveApi();
//     let auth = await G.getAuth();
//     G.downloadFile(await G.getLatestFolderContentsObject(), 'Latest.csv');
// }

// test();
