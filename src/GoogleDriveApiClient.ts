/* eslint-disable max-len */

// REFERENCES:
// GOOGLE DRIVE API V3 DOCS https://developers.google.com/drive/api/v3/
// Metadata of file https://developers.google.com/drive/api/v3/reference/files
import { GoogleAuth, JWT, UserRefreshClient } from 'google-auth-library';
import GoogleDriveApiFileManager from './GoogleDriveApiFileManager';

const DOH_DATA_DROP_FOLDER_ID = '1w_O-vweBFbqCgzgmCpux2F0HVB4P6ni2';
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'];

/**
 * Handles Authorization to Google Drive
 */
class GoogleDriveApi {
  private static instance: GoogleDriveApi;

  auth!: JWT | UserRefreshClient;

  googleDriveApiFileManager!: GoogleDriveApiFileManager;

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
    console.log('\nCheck if Service key exists...');
    if (this.isServiceKeysValid()) {
      console.log('Service key is valid!');
      // console.log('output: ');

      // replace \\n with \n for heroku
      const privateKey = (process.env.PRIVATE_KEY as string).replace(new RegExp('\\\\n', 'g'), '\n');
      this.auth = new GoogleAuth({
        scopes: SCOPES,
      }).fromJSON({
        type: (process.env.TYPE as string),
        project_id: (process.env.PROJECT_ID as string),
        private_key_id: (process.env.PRIVATE_KEY_ID as string),
        private_key: privateKey,
        client_email: (process.env.CLIENT_EMAIL as string),
        client_id: (process.env.CLIENT_ID as string),
      });

      // console.log(this.auth);
      // create file manager as soon as OAuth2 is available
      this.googleDriveApiFileManager = new GoogleDriveApiFileManager(this.auth, DOH_DATA_DROP_FOLDER_ID);
      return this.auth;
    }
    console.log('Service key is NOT valid!');
    throw Error('There was a problem at service key in .env');
  }

  /**
   * verify service keys are all set in .env file
   * @return {boolean}
   */
  isServiceKeysValid = () => (process.env.TYPE as string)
      && (process.env.PROJECT_ID as string)
      && (process.env.PRIVATE_KEY_ID as string)
      && (process.env.PRIVATE_KEY as string)
      && (process.env.CLIENT_EMAIL as string)
      && (process.env.CLIENT_ID as string)

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
   * @return {Promise<String|null>}
   */
  downloadLatestFile() {
    return this.googleDriveApiFileManager.downloadLatestFile();
  }
}

export default GoogleDriveApi;
