/* eslint-disable max-len */

import { JWT, UserRefreshClient } from 'google-auth-library';
import GoogleDriveApiFileManager from '../GoogleDriveApiFileManager';
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
    return this.authorize();
  }

  /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     */
  authorize = async () => new UserRefreshClient();

  /**
   * verify service keys are all set in .env file
   * @return {boolean}
   */
  isServiceKeysValid = () => true

  /**
   * Downloads the latest file from DOH DATA DROP ARCHIVES
   * https://bit.ly/DataDropArchives
   * @return {Promise<Object>}
   */
  downloadLatestFileFromArchives = () => Promise.resolve({});

  /**
   * downloads latest file based from the latest pdf
   * @return {Promise<String|null>}
   */
  downloadLatestFile = () => Promise.resolve('');
}

export default GoogleDriveApi;
