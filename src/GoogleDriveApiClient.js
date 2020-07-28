/* eslint-disable max-len */

// REFERENCES:
// GOOGLE DRIVE API V3 DOCS https://developers.google.com/drive/api/v3/
// Metadata of file https://developers.google.com/drive/api/v3/reference/files
const {GoogleAuth} = require('google-auth-library');
const DOH_DATA_DROP_FOLDER_ID = '1w_O-vweBFbqCgzgmCpux2F0HVB4P6ni2';

const googleDriveApiFileManager = require('./GoogleDriveApiFileManager.js');
const GoogleDriveApiFileManager = googleDriveApiFileManager.GoogleDriveApiFileManager;
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'];

/**
 * Handles Authorization to Google Drive
 */
class GoogleDriveApi {
  /**
   * Initialize variables and make this class a singleton
   * @return {GoogleDriveApi}
   */
  constructor() {
    if (!GoogleDriveApi.instance) {
      GoogleDriveApi.instance = this;
    }
    return GoogleDriveApi.instance;
  }


  /**
     * Entry point for the class
    */
  async getAuth() {
    console.log('Authorizing');
    return this.authorize();
  }

  /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     */
  async authorize() {
    return new Promise((resolve, reject) => {
      console.log('\nCheck if Service key exists...');
      if (this.isServiceKeysValid()) {
        console.log('Service key is valid!');
        console.log('output: ');

        const privateKey = process.env.PRIVATE_KEY.replace(new RegExp('\\\\n', '\g'), '\n');
        this.auth = new GoogleAuth({
          scopes: SCOPES,
        }).fromJSON({
          'type': process.env.TYPE,
          'project_id': process.env.PROJECT_ID,
          'private_key_id': process.env.PRIVATE_KEY_ID,
          'private_key': privateKey,
          'client_email': process.env.CLIENT_EMAIL,
          'client_id': process.env.CLIENT_ID,
        },
        );

        console.log(this.auth);
        // create file manager as soon as OAuth2 is available
        this.googleDriveApiFileManager = new GoogleDriveApiFileManager(this.auth, DOH_DATA_DROP_FOLDER_ID);
        resolve(this.auth);
      } else {
        console.log('Service key is NOT valid!');
        reject(new Error('There was a problem at service key in .env'));
      }
    });
  }

  /**
   * verify service keys are all set in .env file
   * @return {boolean}
   */
  isServiceKeysValid() {
    return process.env.TYPE &&
      process.env.PROJECT_ID &&
      process.env.PRIVATE_KEY_ID &&
      process.env.PRIVATE_KEY &&
      process.env.CLIENT_EMAIL &&
      process.env.CLIENT_ID;
  }

  /**
   * Downloads the latest file from DOH DATA DROP ARCHIVES
   * https://bit.ly/DataDropArchives
   * @return {Promise<Object>}
   */
  downloadLatestFileFromArchives() {
    return this.googleDriveApiFileManager.downloadLatestFileFromArchives();
  }

  /**
   * downloads latest file based from the latest pdf
   * @return {Promise<void>}
   */
  downloadLatestFile() {
    return this.googleDriveApiFileManager.downloadLatestFile();
  }
}

exports.GoogleDriveApi = GoogleDriveApi;
