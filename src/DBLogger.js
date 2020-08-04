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
    return this.dba.insert('update_history', {'id': 'NULL', 'folder_id': `'${folderID}'`, 'updated_at': 'current_timestamp()'});
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
