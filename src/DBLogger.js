/* eslint-disable require-jsdoc,max-len */
const DatabaseAdapter = require('./Database/DatabaseAdapter');

class DBLogger {
  constructor() {
    return (async () => {
      if (!DBLogger.instance) {
        DBLogger.instance = this;
        this.dba = await new DatabaseAdapter();
      }

      return DBLogger.instance;
    })();
  }

  /**
   *
   * @return {Promise<String>}
   */
  async getLatestFolderID() {
    return this.dba.getLatestFolderID();
  }

  async insertToUpdateSummary(folderID) {
    if (process.env.DATABASE_TYPE.toLowerCase() === 'mysql') {
      return this.dba.insert('update_history', {'id': 'NULL', 'folder_id': `'${folderID}'`, 'updated_at': 'current_timestamp()'});
    } else if (process.env.DATABASE_TYPE.toLowerCase() === 'nosql') {
      return this.dba.insert('update_history', {'folder_id': `${folderID}`, 'updated_at': `${new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
      })}`});
    } else {
      throw new Error('No DATABASE_TYPE specified');
    }
  }

  /**
   *
   * @return {Promise<String>}
   */
  async getLastUpdateDate() {
    return this.dba.getLastUpdateDate();
  }
}

module.exports = DBLogger;
