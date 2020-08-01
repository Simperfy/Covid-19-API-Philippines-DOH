/* eslint-disable require-jsdoc,max-len */
const DatabaseAdapter = require('./Database/DatabaseAdapter');
const MySQLDatabase = require('./Database/MySQLDatabase');

class Logger {
  constructor() {
    this.db = new DatabaseAdapter(new MySQLDatabase());
  }

  getLatestUpdateSummary() {

  }

  async insertToUpdateSummary(folderID) {
    await this.db.insert('update_history', {'id': 'NULL', 'folder_id': `'${folderID}'`, 'updated_at': 'current_timestamp()'});
  }
}

module.exports = Logger;
