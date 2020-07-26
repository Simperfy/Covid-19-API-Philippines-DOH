/* eslint-disable max-len */

// REFERENCES:
// GOOGLE DRIVE API V3 DOCS https://developers.google.com/drive/api/v3/
// Metadata of file https://developers.google.com/drive/api/v3/reference/files
const fs = require('fs');
const {google} = require('googleapis');
const path = require('path');
const DOH_DATA_DROP_FOLDER_ID = '1w_O-vweBFbqCgzgmCpux2F0HVB4P6ni2';

const googleDriveApiFileManager = require('./GoogleDriveApiFileManager.js');
const GoogleDriveApiFileManager = googleDriveApiFileManager.GoogleDriveApiFileManager;
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const TOKEN_PATH = path.join(__dirname, '../token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');

/**
 * Handles Authorization to Google Drive
 */
class GoogleDriveApi {
  /**
   * Initialize variables and make this class a singleton
   * @return {GoogleDriveApi}
   */
  constructor() {
    if (process.env.NODE_ENV === 'development') {
      console.log('checking credentials.json in ' + CREDENTIALS_PATH);
      if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error('[googleDriveApiClient.js] MISSING credentials.json, Get one at https://developers.google.com/drive/api/v3/quickstart/go');
      }
    } else {
      console.log('skipping verification of credentials.json');
    }

    if (!GoogleDriveApi.instance) {
      GoogleDriveApi.instance = this;
    }
    return GoogleDriveApi.instance;
  }

  // @TODO this getAuth() function violates Open/Closed Principle
  /**
     * Entry point for the class
     * @return {Promise<Promise<Object>>} returns auth api from google drive api
    */
  async getAuth() {
    console.log('Authorizing');
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(CREDENTIALS_PATH)) {
        // load client secrets from .env file
        console.log('Credentials.json not found, using values in .env instead.');
        console.log('Validating .env file');
        if (
          !process.env.CLIENT_ID ||
          !process.env.CLIENT_ID ||
          !process.env.PROJECT_ID ||
          !process.env.AUTH_URI ||
          !process.env.TOKEN_URI ||
          !process.env.AUTH_PROVIDER_X509_CERT_URL ||
          !process.env.CLIENT_SECRET ||
          !process.env.REDIRECT_URIS1 ||
          !process.env.JAVASCRIPT_ORIGINS1
        ) {
          return reject(new Error('ERROR: Invalid .env variables'));
        }

        console.log('Crafting credentials.json with environment values');
        const credentials = {
          'web': {
            'client_id': process.env.CLIENT_ID,
            'project_id': process.env.PROJECT_ID,
            'auth_uri': process.env.AUTH_URI,
            'token_uri': process.env.TOKEN_URI,
            'auth_provider_x509_cert_url': process.env.AUTH_PROVIDER_X509_CERT_URL,
            'client_secret': process.env.CLIENT_SECRET,
            'redirect_uris': [
              process.env.REDIRECT_URIS1,
              process.env.REDIRECT_URIS2,
            ],
            'javascript_origins': [
              process.env.JAVASCRIPT_ORIGINS1,
              process.env.JAVASCRIPT_ORIGINS2,
            ],
          },
        };
        // console.log(credentials);
        resolve(this.authorize(credentials));
      } else {
        // Load client secrets from a local file.
        fs.readFile(CREDENTIALS_PATH, (err, content) => {
          if (err) return reject(new Error('Error loading client secret file: ' + err));
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
     */
  async authorize(credentials) {
    // console.log(credentials);
    return new Promise((resolve, reject) => {
      const {client_secret: clientSecret, client_id: clientId, redirect_uris: redirectUris} = credentials.web;
      // console.log(credentials.web);
      console.log(redirectUris[process.env.NODE_ENV === 'production' ? 1 : 0]);
      this.oAuth2Client = new google.auth.OAuth2(
          clientId, clientSecret, redirectUris[process.env.NODE_ENV === 'production' ? 1 : 0]);

      // console.log(this.oAuth2Client);

      // create file manager as soon as OAuth2 is available
      this.googleDriveApiFileManager = new GoogleDriveApiFileManager(this.oAuth2Client, DOH_DATA_DROP_FOLDER_ID);

      // Delete Token if expired
      this.deleteExpiredToken();

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          const authErr = {
            'err': err,
            'scopes': SCOPES,
          };
          return reject(authErr);
        }
        this.oAuth2Client.setCredentials(JSON.parse(token));
        resolve(this.oAuth2Client);
      });
    });
  }

  /**
   * Fetches and downloads token.json
   * @param {String} code Code returned by Google URL Callback
   */
  getAndStoreToken(code) {
    this.oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      this.oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) throw new Error('[googleDriveApiClient.js] ' + err);
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  }

  /**
   * Deletes Expired Token
   * @return {void}
   */
  deleteExpiredToken() {
    console.log('\nChecking if token is expired');

    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        console.log('Token not found. Get one at localhost:3000');
        return;
      }

      token = JSON.parse(token);
      // console.log(token.expiry_date);
      const expiryDate = new Date(token.expiry_date);
      const currentDate = new Date();

      if (currentDate > expiryDate) {
        console.log('Token expired, deleting...');
        fs.unlinkSync(TOKEN_PATH);
      } else {
        console.log('Token still valid.');
      }
    });
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
exports.TOKEN_PATH = TOKEN_PATH;
