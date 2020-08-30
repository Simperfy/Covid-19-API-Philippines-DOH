/* eslint-disable require-jsdoc,max-len */
import DatabaseAdapter from './Database/DatabaseAdapter';

class DBLogger {
  private static instance: DBLogger;
  private dba!: DatabaseAdapter;

  async init() {
    if (!DBLogger.instance) {
      DBLogger.instance = this;
      this.dba = await new DatabaseAdapter().init();
    }

    return DBLogger.instance;
  }

  /**
   *
   * @return {Promise<String>}
   */
  async getLatestFolderID() {
    return this.dba.getLatestFolderID();
  }

  async insertToUpdateSummary(folderID: string) {
    if ((process.env.DATABASE_TYPE as string).toLowerCase() === 'mysql') {
      return this.dba.insert('update_history', {'id': 'NULL', 'folder_id': `'${folderID}'`, 'updated_at': 'current_timestamp()'});
    } else if ((process.env.DATABASE_TYPE as string).toLowerCase() === 'nosql') {
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

export default DBLogger;
