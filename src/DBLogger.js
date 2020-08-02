/* eslint-disable require-jsdoc,max-len */
const DatabaseAdapter = require('./Database/DatabaseAdapter');
const MySQLDatabase = require('./Database/MySQLDatabase');

class DBLogger {
  constructor() {
    return (async () => {
      if (!DBLogger.instance) {
        DBLogger.instance = this;
        this.db = await new DatabaseAdapter(new MySQLDatabase());
      }

      return DBLogger.instance;
    })();
  }

  /**
   *
   * @return {Promise<String>}
   */
  async getLatestFolderID() {
    const res = await this.db.executeRaw(`SELECT folder_id FROM update_history ORDER BY updated_at DESC LIMIT 1`);
    console.log('res: ', res[0]);
    if (!res[0]) {
      return '';
    }
    return res[0].folder_id || '';
  }

  async insertToUpdateSummary(folderID) {
    return this.db.insert('update_history', {'id': 'NULL', 'folder_id': `'${folderID}'`, 'updated_at': 'current_timestamp()'});
  }
}

module.exports = DBLogger;
