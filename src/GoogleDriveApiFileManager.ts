/* eslint-disable max-len */
import * as readline from 'readline';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { tall } from 'tall';
import PDFHandler from './PDFHandler';
import { DOWNLOAD_STATUS, DOWNLOADED_FILE_ALIASES } from './utils/enums';
import { filesToSearch as FILES_TO_SEARCH } from './utils/constants';
import { getRequiredFiles } from './utils/helper';
import DBLogger from './DBLogger';

const TMP_PATH = path.join(__dirname, '../tmp');
const DATA_DROP_LINK = 'http://bit.ly/DataDropPH';

/**
 * Handles Google Files
 */
class GoogleDriveApiFileManager {
  auth: any;

  rootFolderID: string;

  private latestFolderName!: string;

  /**
   * Initialize Variable
   * @param {OAuth2Client} auth
   * @param {String} rootFolderID
   */
  constructor(auth: OAuth2Client, rootFolderID: string) {
    this.auth = auth;
    this.rootFolderID = rootFolderID;
  }

  /* listFiles() {
    const auth = this.auth;
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
  } */

  /**
   * @param {String} query Search query
   * @param {int} pageSize max number of result
   * @return {Promise} contains files object with name and id
   */
  /* searchFiles(query, pageSize = 10) {
    return new Promise((resolve, reject) => {
      const auth = this.auth;
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
  } */

  /**
   * @typedef {Object} files
   * @property {String} id - id of the file
   * @property {String} name - file name when saved
   * @param {String} folderID
   * @return {Promise<[files]>} - contains name and id of folders in the root `folder
   */
  async getFilesInRootFolder(folderID: string = this.rootFolderID): Promise<any[]> {
    const { auth } = this;
    const drive = google.drive({ version: 'v3', auth });
    const res: any = await drive.files.list({
      q: `'${folderID}' in parents`,
      fields: 'nextPageToken, files(id, name)',
    });

    const { files } = res.data;

    if (files.length === 0) throw Error('No Files Found');

    console.log('\nFiles in root folder:');
    files.forEach((file: any) => {
      console.log(`${file.name} ${file.id}`);
    });

    return files;
  }

  /**
   * @return {String} ID of the folder this month
   */
  async getGFolderIDThisMonth() {
    const date = new Date();
    const month = (date.getMonth()) + 1;
    const searchString = `(0${month})`;

    const folders = await this.getFilesInRootFolder();
    console.log(`\nFiltering "${searchString}": `);
    const res = folders.filter((file) => {
      console.log(`${(file.name.search(searchString)) !== -1} : ${file.name}`);
      return ((file.name.search(searchString)) !== -1);
    });

    if (res.length === 1) {
      return res[0].id;
    }
    throw Error('[googleDriveApiFileManager.js] Folder this month couldn\'t be found');
  }

  /**
   * We get the latest folder by ordering the result by name in descending order
   * therefore the first element in result is the latest
   * we cannot use date modified/create date because DOH create/modify these folders from time to time.
   * @return {Object} Contains ID and Name of the latest folder inside this month's folder
   */
  async getLatestGFolderObject() {
    const id = await this.getGFolderIDThisMonth();
    console.log(`\nThis month folder id: ${id}`);

    const { auth } = this;
    const drive = google.drive({ version: 'v3', auth });

    drive.files.list({
      q: `'${id}' in parents`,
      orderBy: 'name desc',
      fields: 'nextPageToken, files(id, name)',
    }, (err, res: any) => {
      if (err) throw Error(`The API returned an error: ${err}`);
      const { files } = res.data;
      if (files.length) {
        console.log('\nFiles inside this month\'s folder:');
        files.forEach((file: any) => {
          console.log(`${file.name} ${file.id}`);
        });
        return files[0];
      }

      console.log('No files found.');
      throw Error('[googleDriveApiFileManager.js] No files found in this month\'s folder');
    });
  }

  /**
   * @return {Promise} Object with name and id of the items inside latest folder
   */
  async getLatestFolderContentsObject() {
    const latestFolder: any = await this.getLatestGFolderObject();
    const { id } = latestFolder;
    this.latestFolderName = latestFolder.name;
    console.log(`\nLatest folder id: ${id}`);

    const { auth } = this;
    const drive = google.drive({ version: 'v3', auth });
    const searchString = 'Case Information.csv';

    drive.files.list({
      q: `'${id}' in parents`,
      orderBy: 'name',
      fields: 'nextPageToken, files(id, name)',
    }, (err, { data }: any) => {
      if (err) throw Error(`The API returned an error: ${err}`);
      const { files } = data;
      if (files.length) {
        console.log(`\nFiltering "${searchString}":`);
        const res = files.filter((file: any) => {
          console.log(`${(file.name.search(searchString)) !== -1} : ${file.name}`);
          return ((file.name.search(searchString)) !== -1);
        });

        if (res.length === 1) {
          return res[0];
        }
        throw Error(`[googleDriveApiFileManager.js] No results from search. Search String = ${searchString}`);
      }

      console.log('No files found.');
      throw Error('[googleDriveApiFileManager.js] No files found in latest folder');
    });
  }

  /**
   * @param {Object} fileObj File Object containing ID and name of the file when saved
   * @param {String} fileObj.id id of the file
   * @param {String} fileObj.name name of the file when saved
   * @param {String} name Name of the file that will be downloaded
   * @return {Promise<String>} filePath to the downloaded file
   */
  async downloadFile(fileObj: any, name = 'Data.csv'): Promise<string> {
    try {
      console.log(`\nDOWNLOADING FILE: ${fileObj.name}`);

      const { auth } = this;
      const drive = google.drive({ version: 'v3', auth });
      const res: any = await drive.files
        .get({ fileId: fileObj.id, alt: 'media' }, { responseType: 'stream' }).catch((err) => console.log(err));
      await fs.promises.mkdir(TMP_PATH, { recursive: true });
      const filePath = `${TMP_PATH}/${name}`;

      console.log(`\nSaving to ${filePath}`);
      const dest = fs.createWriteStream(filePath);
      let progress = 0;

      return new Promise((resolve, reject) => {
        res.data
          .on('end', () => {
            console.log(`\nDone downloading file. ${fileObj.name}`);
            resolve(filePath);
          })
          .on('error', (err: Error) => {
            console.error('Error downloading file.');
            reject(Error(`[googleDriveApiFileManager.js] ${err}`));
          })
          .on('data', (d: any) => {
            progress += d.length;
            if (process.stdout.isTTY) {
              readline.clearLine(process.stdout, 0);
              readline.cursorTo(process.stdout, 0);
              process.stdout.write(`Downloaded ${progress} bytes`);
            }
          })
          .pipe(dest);

        dest.on('finish', () => {
          dest.close();
        });
      });
    } catch (e) {
      throw Error(`Error occured while downloading ${fileObj.name}`);
    }
  }

  /**
   * @param {Object[]} files An array of object of files
   * @param {String} files[].id file id
   * @param {String} files[].name Original name of the file
   * @param {String|undefined} files[].alias Alternative name of the file
   */
  async downloadFiles(files: any[]) {
    if ((process.env.SKIP_DOWNLOADS as string).toLowerCase() === 'true') {
      console.log('[DEBUG] SKIPPING DOWNLOAD OF CSV FILES');
      console.log('Make sure you downloaded the csv files.');
    } else {
      console.log('Downloading multiple files:');
      console.log(files);

      const promises = files.map((file) => {
        const fileName = file.alias || file.name;
        return this.downloadFile(file, fileName);
      });

      try {
        await Promise.all(promises);
      } catch (err) {
        console.log('Something went wrong while downloading files.');
      }

      console.log('\nDone downloading multiple files.');
    }
  }

  /**
   * @return {Promise<Object>} ibject containing name of folder file and file path of downloaded file
   */
  async downloadLatestFileFromArchives() {
    const latestFolderObject: any = await this.getLatestFolderContentsObject();
    const filePath = await this.downloadFile(latestFolderObject, 'Data.csv');
    const data: any = {
      latestFolderName: null,
      downloadedFilePath: null,
    };

    data.latestFolderName = latestFolderObject.name;
    data.downloadedFilePath = filePath;
    return data;
  }

  /**
   * downloads latest pdf file
   * @return {Promise<void>}
   */
  async downloadLatestPDF() {
    try {
      const longUrl = await tall(DATA_DROP_LINK);
      const folderID = this.extractFolderIDFromURL(longUrl);
      console.log(`Downloading latest pdf from folder id: ${folderID}`);
      const files = await this.getFilesInRootFolder(folderID);
      console.log(files);
      return await this.downloadFile(files[0], 'latest.pdf');
    } catch (e) {
      throw Error('[GoogleDriveApiFileManager.js] error while downloading latest pdf');
    }
  }

  /**
   *
   * @return {Promise<String|Boolean>}
   */
  async downloadLatestFileFromDataDrop() {
    try {
      await this.downloadLatestPDF();
      const p = new PDFHandler();
      const shortLink = await p.getLatestFolderLink();
      console.log(`\nshortUrl: ${shortLink}`);

      const longUrl = await tall(shortLink);
      console.log(`Long url: ${longUrl}`);
      const folderID = this.extractFolderIDFromURL(longUrl);
      const dbLogger = await new DBLogger().init();
      const previousFolderID = await dbLogger.getLatestFolderID();

      if (folderID === previousFolderID && (process.env.BYPASS_FOLDERID_CHECK as string).toLowerCase() === 'false') {
        console.log('\nPrevious folder ID is the same as target folder ID');
        console.log('Skipping the download of csv file');
        return DOWNLOAD_STATUS.DOWNLOAD_SKIPPED;
      }

      console.log(`\nFolder ID: ${folderID}`);
      console.log('Logging folder id...');
      await dbLogger.insertToUpdateSummary(folderID);

      const files = await this.getFilesInRootFolder(folderID);
      const reqFiles = getRequiredFiles(files, FILES_TO_SEARCH);

      // @TODO @DOGGO Make a function for adding alias
      const reqFilesWithAliases = reqFiles.map((file: any) => {
        let { alias } = file;

        if (file.name.search(FILES_TO_SEARCH[0]) !== -1) { // case information
          alias = DOWNLOADED_FILE_ALIASES.CASE_INFORMATION;
        } else if (file.name.search(FILES_TO_SEARCH[1]) !== -1) { // DOH data collect - daily report
          alias = DOWNLOADED_FILE_ALIASES.DAILY_REPORT;
        }

        return { ...file, alias };
      });

      if (files.length < 0) return Error('[GoogleDriveApiFileManager.js] Error no files found.');

      await this.downloadFiles(reqFilesWithAliases);
      return DOWNLOAD_STATUS.DOWNLOADED_LATEST_FILE_SUCCESS;
    } catch (err) {
      console.log(`Error downloading latest file from data drop ${err.message}`);
      return DOWNLOAD_STATUS.DOWNLOADED_LATEST_FILE_FAILED;
    }
  }

  /**
   * Downloads Latest file from DataDrop or DataDrop Archives
   * @return {Promise<String|null>}
   */
  async downloadLatestFile() {
    console.log('Downloading latest csv file from latest pdf');
    const data = await this.downloadLatestFileFromDataDrop();
    switch (data) {
      case DOWNLOAD_STATUS.DOWNLOAD_SKIPPED:
        return DOWNLOAD_STATUS.DOWNLOAD_SKIPPED;
      case DOWNLOAD_STATUS.DOWNLOADED_LATEST_FILE_FAILED:
        console.log('\nDownloading latest csv file from archives instead');
        await this.downloadLatestFileFromArchives();
        return DOWNLOAD_STATUS.DOWNLOADED_FROM_ARCHIVES;
      case DOWNLOAD_STATUS.DOWNLOADED_LATEST_FILE_SUCCESS:
        return DOWNLOAD_STATUS.DOWNLOADED_LATEST_FILE_SUCCESS;
      default:
        throw Error('Download Status Undefined');
    }
  }

  /**
   * extracts id from url.
   * ie: https://drive.google.com/drive/folders/1ZPPcVU4M7T-dtRyUceb0pMAd8ickYf8o?usp=sharing
   * returns 1ZPPcVU4M7T-dtRyUceb0pMAd8ickYf8o
   * @param {String} url
   * @return {String}
   */
  extractFolderIDFromURL = (url: string) => url.split('/')[5].split('?')[0];
}

export default GoogleDriveApiFileManager;
