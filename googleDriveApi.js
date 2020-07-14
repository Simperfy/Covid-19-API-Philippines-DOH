const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

class GoogleDriveApi {
    oAuth2Client = null;
    // make this a singleton
    constructor() {
        if (!GoogleDriveApi.instance) {
            GoogleDriveApi.instance = this;
        }
        return GoogleDriveApi.instance;
    }

    async getAuth() {
        return new Promise((resolve) =>  {
            resolve(this.run());
        });
    }

    // Entry point for the class
    async run() {
        // Load client secrets from a local file.
        return new Promise(resolve => {
            fs.readFile('credentials.json', (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                console.log('Authorizing');
                // Authorize a client with credentials, then call the Google Drive API.
                resolve(this.authorize(JSON.parse(content), (_) => { }));
            });
        });
    }
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    async authorize(credentials, callback) {
        // console.log(credentials);
        return new Promise(resolve => {
            const { client_secret, client_id, redirect_uris } = credentials.web;
            this.oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);

            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) return getAccessToken(this.oAuth2Client, callback);
                this.oAuth2Client.setCredentials(JSON.parse(token));
                resolve(this.oAuth2Client);
                // console.log('\n WRITING credentials');
                // console.log(this.oAuth2Client);
                // console.log(JSON.parse(token));
                // callback(oAuth2Client);
            });
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                // callback(oAuth2Client);
            });
        });
    }

    /** 
     * @param {array} files An array of object of files
    */
    downloadFiles(files) {
        files.array.forEach(file => {
            console.log('FILESSSS');
            console.log(file.id);
        });
    }

    /**
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    listFiles() {
        const auth = this.oAuth2Client;
        // console.log(auth);
        const drive = google.drive({ version: 'v3', auth });
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
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     * @param {String} query Search query
     * @param {int} pageSize max number of result
     */
    searchFiles(query, pageSize = 10) {
        return new Promise(resolve => {
            const auth = this.oAuth2Client;
            const drive = google.drive({ version: 'v3', auth });
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
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     * @param {String} fileId File ID of the file
     */
    async downloadFile(fileId) {
        const auth = this.oAuth2Client;
        const drive = google.drive({ version: 'v3', auth });
        const res = await drive.files
            .get({ fileId, alt: 'media' }, { responseType: 'stream' });
        return new Promise((resolve, reject) => {
            // const filePath = path.join(os.tmpdir(), uuid.v4());
            const filePath = path.relative(process.cwd(), 'tmp/Data.csv');
            console.log(`writing to ${filePath}`);
            const dest = fs.createWriteStream(filePath);
            let progress = 0;

            res.data
                .on('end', () => {
                    console.log('Done downloading file.');
                    resolve(filePath);
                })
                .on('error', err => {
                    console.error('Error downloading file.');
                    reject(err);
                })
                .on('data', d => {
                    progress += d.length;
                    if (process.stdout.isTTY) {
                        process.stdout.clearLine();
                        process.stdout.cursorTo(0);
                        process.stdout.write(`\nDownloaded ${progress} bytes`);
                    }
                })
                .pipe(dest);
        });

    }
}

exports.GoogleDriveApi = GoogleDriveApi;

// /**
// * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
// */

// async function entryPoint() {
//     let GApi = new GoogleDriveApi();
//     GApi.listFiles(auth);
//     await GApi.searchFiles(auth, 'name contains \'DOH COVID Data Drop_ 2020\' and name contains \'Case Information\'').then(covidData => {
//         console.log(covidData[0]);

//         GApi.downloadFile(auth, covidData[0].id);

//     }).catch(err => console.log("\nERROR: " + err));
// }


// exports async function getOAuth2Client(auth) {
//     return auth();
// }