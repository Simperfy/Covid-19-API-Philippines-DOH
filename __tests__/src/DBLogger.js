/* eslint-disable max-len,require-jsdoc */
require('dotenv').config();
const DBLogger = require('../../src/DBLogger');

class DatabaseAdapterMock {
  executeRaw() {
    return [{'folder_id': 'folder 3'}];
  }
}

test('should return latest folder id', async () => {
  const dbLogger = await new DBLogger();
  dbLogger.db = new DatabaseAdapterMock();
  const executeRawMock = jest.spyOn(dbLogger.db, 'executeRaw');

  const res = await dbLogger.getLatestFolderID();

  expect(executeRawMock).toHaveBeenCalled();
  expect(res).toBe('folder 3');
});
