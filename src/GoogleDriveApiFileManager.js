/* eslint-disable max-len,require-jsdoc,no-throw-literal */
const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');
const TMP_PATH = path.join(__dirname, '/../tmp');
const urlExpander = require('expand-url');

class GoogleDriveApiFileManager {
  constructor(oAuth2Client, rootFolderID) {
    this.oAuth2Client = oAuth2Client;
    this.rootFolderID = rootFolderID;
  }

  /* listFiles() {
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
  }*/

  /**
   * @param {String} query Search query
   * @param {int} pageSize max number of result
   * @return {Promise} contains files object with name and id
   */
  /* searchFiles(query, pageSize = 10) {
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
  }*/

  /**
   * @typedef {Object} files
   * @property {String} id - id of the file
   * @property {String} name - file name when saved
   * @param {String} folderID
   * @return {[files]} - contains name and id of folders in the root folder
   */
  async getFilesInRootFolder(folderID = this.rootFolderID) {
    return new Promise((resolve)=> {
      const auth = this.oAuth2Client;
      const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        q: `'${folderID}' in parents`,
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
      console.log((-1 !== (file.name.search(searchString))) + ' : ' + file.name);
      return (-1 !== (file.name.search(searchString)));
    });

    if (res.length === 1) {
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
            console.log((-1 !== (file.name.search(searchString))) + ' : ' + file.name);
            return (-1 !== (file.name.search(searchString)));
          });

          if (res.length === 1) {
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
   * @param {Object} fileObj File Object containing ID and name of the file when saved
   * @param {String} fileObj.id id of the file
   * @param {String} fileObj.name name of the file when saved
   * @param {String} name Name of the file that will be downloaded
   * @return {Promise<String>} filePath to the downloaded file
   */
  async downloadFile(fileObj, name = 'Data.csv') {
    console.log('DOWNLOADING LATEST FILE: ' + fileObj.name);

    const auth = this.oAuth2Client;
    const drive = google.drive({version: 'v3', auth});
    const res = await drive.files
        .get({fileId: fileObj.id, alt: 'media'}, {responseType: 'stream'}).catch((err) => console.log(err));
    await fs.promises.mkdir(TMP_PATH, {recursive: true});
    const filePath = `${TMP_PATH}/${name}`;

    console.log(`writing to ${filePath}`);
    const dest = fs.createWriteStream(filePath);
    let progress = 0;

    return new Promise((resolve) => {
      res.data
          .on('end', () => {
            console.log('\nDone downloading file. ' + this.latestFolderName);
            resolve(filePath);
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
   * @return {Promise<Object>} ibject containing name of folder file and file path of downloaded file
   */
  async downloadLatestFileFromArchives() {
    const latestFolderObject = await this.getLatestFolderContentsObject();
    const filePath = await this.downloadFile(latestFolderObject, 'Data.csv');
    return new Promise((resolve) => {
      const data = {
        latestFolderName: null,
        downloadedFilePath: null,
      };

      data.latestFolderName = latestFolderObject.name;
      data.downloadedFilePath = filePath;
      resolve(data);
    });
  }

  async downloadLatestFile() {
    const t = this;
    urlExpander.expand('http://bit.ly/DataDropPH', async (err, longUrl) => {
      // https://drive.google.com/drive/folders/1ZPPcVU4M7T-dtRyUceb0pMAd8ickYf8o?usp=sharing
      const folderID = longUrl.split('/')[5].split('?')[0];
      console.log(folderID);
      const files = await t.getFilesInRootFolder(folderID);
      console.log(files);
      await t.downloadFile(files[0], 'latest.pdf');
    });
  }
}

exports.GoogleDriveApiFileManager = GoogleDriveApiFileManager;
