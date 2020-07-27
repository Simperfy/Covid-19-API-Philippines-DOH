/* eslint-disable max-len*/
const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');
const urlExpander = require('expand-url');

const PDFHandler = require('./PDFHandler').PDFHandler;

const TMP_PATH = path.join(__dirname, '/../tmp');
const DATA_DROP_LINK = 'http://bit.ly/DataDropPH';

/**
 * Handles Google Files
 */
class GoogleDriveApiFileManager {
  /**
   * Initialize Variable
   * @param {OAuth2Client} auth
   * @param {String} rootFolderID
   */
  constructor(auth, rootFolderID) {
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
  }*/

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
  }*/

  /**
   * @typedef {Object} files
   * @property {String} id - id of the file
   * @property {String} name - file name when saved
   * @param {String} folderID
   * @return {Promise<[files]>} - contains name and id of folders in the root folder
   */
  getFilesInRootFolder(folderID = this.rootFolderID) {
    return new Promise((resolve, reject)=> {
      const auth = this.auth;
      const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        q: `'${folderID}' in parents`,
        fields: 'nextPageToken, files(id, name)',
      }).then((res) => {
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
      }).catch((err) => {
        console.log('An Error Occurred while getting a list of files');
        console.log('Reason: ' + err);
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

    await this.getFilesInRootFolder().then((folders) => {
      console.log(`\nFiltering "${searchString}": `);
      const res = folders.filter((file) => {
        console.log((-1 !== (file.name.search(searchString))) + ' : ' + file.name);
        return (-1 !== (file.name.search(searchString)));
      });

      if (res.length === 1) {
        return res[0].id;
      }

      throw new Error('[googleDriveApiFileManager.js] Folder this month couldn\'t be found');
    }).catch((err) => {
      console.log('[googleDriveApiFileManager.js] ' + err);
    });
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

    const auth = this.auth;
    const drive = google.drive({version: 'v3', auth});

    return new Promise((resolve, reject) => {
      drive.files.list({
        q: `'${id}' in parents`,
        orderBy: 'name desc',
        fields: 'nextPageToken, files(id, name)',
      }, (err, res) => {
        if (err) return reject(new Error('The API returned an error: ' + err));
        const files = res.data.files;
        if (files.length) {
          console.log(`\nFiles inside this month's folder:`);
          files.map((file) => {
            console.log(`${file.name} ${file.id}`);
          });
          resolve(files[0]);
        } else {
          console.log('No files found.');
          return reject(new Error('[googleDriveApiFileManager.js] No files found in this month\'s folder'));
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

    const auth = this.auth;
    const drive = google.drive({version: 'v3', auth});
    const searchString = 'Case Information.csv';

    return new Promise((resolve, reject) => {
      drive.files.list({
        q: `'${id}' in parents`,
        orderBy: 'name',
        fields: 'nextPageToken, files(id, name)',
      }, (err, res) => {
        if (err) return reject(new Error('The API returned an error: ' + err));
        const files = res.data.files;
        if (files.length) {
          console.log(`\nFiltering "${searchString}":`);
          const res = files.filter((file) => {
            console.log((-1 !== (file.name.search(searchString))) + ' : ' + file.name);
            return (-1 !== (file.name.search(searchString)));
          });

          if (res.length === 1) {
            resolve(res[0]);
          } else {
            return reject(new Error('[googleDriveApiFileManager.js] No results from search. Search String = ' + searchString));
          }
        } else {
          console.log('No files found.');
          return reject(new Error('[googleDriveApiFileManager.js] No files found in latest folder'));
        }
      });
    });
  }

  /**
   * @param {Object} fileObj File Object containing ID and name of the file when saved
   * @param {String} fileObj.id id of the file
   * @param {String} fileObj.name name of the file when saved
   * @param {String} name Name of the file that will be downloaded
   * @return {Promise<String>} filePath to the downloaded file
   */
  async downloadFile(fileObj, name = 'Data.csv') {
    console.log('\nDOWNLOADING FILE: ' + fileObj.name);

    const auth = this.auth;
    const drive = google.drive({version: 'v3', auth});
    const res = await drive.files
        .get({fileId: fileObj.id, alt: 'media'}, {responseType: 'stream'}).catch((err) => console.log(err));
    await fs.promises.mkdir(TMP_PATH, {recursive: true});
    const filePath = `${TMP_PATH}/${name}`;

    console.log(`writing to ${filePath}`);
    const dest = fs.createWriteStream(filePath);
    let progress = 0;

    return new Promise((resolve, reject) => {
      res.data
          .on('end', () => {
            console.log('\nDone downloading file. ' + fileObj.name);
            resolve(filePath);
          })
          .on('error', (err) => {
            console.error('Error downloading file.');
            return reject(new Error('[googleDriveApiFileManager.js] ' + err));
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
   * @return {Promise<Object>} ibject containing name of folder file and file path of downloaded file
   */
  async downloadLatestFileFromArchives() {
    const latestFolderObject = await this.getLatestFolderContentsObject();
    const filePath = await this.downloadFile(latestFolderObject, 'Data.csv');
    return new Promise((resolve, reject) => {
      const data = {
        latestFolderName: null,
        downloadedFilePath: null,
      };

      data.latestFolderName = latestFolderObject.name;
      data.downloadedFilePath = filePath;
      resolve(data);
    });
  }

  /**
   * downloads latest pdf file
   * @return {Promise<void>}
   */
  async downloadLatestPDF() {
    const t = this;
    return new Promise((resolve, reject) => {
      urlExpander.expand(DATA_DROP_LINK, async (err, longUrl) => {
        if (err) return reject(new Error('[GoogleDriveApiFileManager.js] ' + err));
        const folderID = this.extractFolderIDFromURL(longUrl);
        console.log('Downloading latest pdf from folder id: ' + folderID);
        await t.getFilesInRootFolder(folderID).then(async (files) => {
          console.log(files);
          resolve(await t.downloadFile(files[0], 'latest.pdf'));
        }).catch((err) => reject(err));
      });
    });
  }

  /**
   *
   * @return {Promise<void>}
   */
  async downloadLatestFileFromDataDrop() {
    const t = this;

    return new Promise((resolve, reject) => {
      this.downloadLatestPDF().then(async () => {
        // @TODO @DOGGO Couldn't think of a much better solution atm, Refactor this code in the future.
        let isErr = false;
        const p = new PDFHandler();
        const shortLink = await p.getLatestFolderLink().catch((err) => {
          isErr = true;
          resolve(false);
        });
        if (isErr) return;
        // @TODO @DOGGO Until here

        console.log('\nshortUrl: ' + shortLink);
        urlExpander.expand(shortLink, async (err, longUrl) => {
          if (err) return reject(new Error('[GoogleDriveApiFileManager.js] ' + err));
          console.log('Long url: ' + longUrl);
          const folderID = this.extractFolderIDFromURL(longUrl);
          console.log('Folder ID: ' + folderID);
          await t.getFilesInRootFolder(folderID).then(async (files) => {
            // console.log(files);
            const file = files.filter((data) =>
              (-1 !== data.name.search('Case Information.csv')),
            );
            if (file.length < 0) {
              return reject(new Error('[GoogleDriveApiFileManager.js] Error Case information.csv not found'));
            }
            console.log('Latest file info(From PDF): ' + file[0]);
            resolve(await t.downloadFile(file[0], 'Data.csv'));
          }).catch((err) => console.log('[GoogleDriveApiFileManager.js]  '+ err));
        });
      });
    });
  }

  /**
   * Downloads Latest file from DataDrop or DataDrop Archives
   * @return {Promise<void>}
   */
  async downloadLatestFile() {
    // @TODO @DOGGO This code needs refactoring
    const t = this;
    console.log('Downloading latest csv file from latest pdf');
    await this.downloadLatestFileFromDataDrop().then((data) => {
      if (data === false) {
        console.log('\nDownloading latest csv file from archives instead');
        t.downloadLatestFileFromArchives().catch((err) => {
          console.log(err);
          console.log('\ncsv file also failed to be downloaded from archives');
        });
      }
    }).catch((err) => console.log(err));
  }

  /**
   * extracts id from url.
   * ie: https://drive.google.com/drive/folders/1ZPPcVU4M7T-dtRyUceb0pMAd8ickYf8o?usp=sharing
   * returns 1ZPPcVU4M7T-dtRyUceb0pMAd8ickYf8o
   * @param {String} url
   * @return {String}
   */
  extractFolderIDFromURL(url) {
    return url.split('/')[5].split('?')[0];
  }
}

exports.GoogleDriveApiFileManager = GoogleDriveApiFileManager;
