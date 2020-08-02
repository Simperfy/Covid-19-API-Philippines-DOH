/* eslint-disable max-len,require-jsdoc */
require('dotenv').config();
const DBLogger = require('../../src/DBLogger');

class DatabaseAdapterMock {
  executeRaw(query) {
    return [{'folder_id': 'folder 3'}];
  }

  insert(tableName, fieldValueObj) {
    return 'success';
  }
}

let dbLogger = null;
let realDB = null;

beforeAll(async () => {
  dbLogger = await new DBLogger();
  realDB = dbLogger.db;
  dbLogger.db = new DatabaseAdapterMock();
});

test('should return latest folder id', async () => {
  const executeRawMock = jest.spyOn(dbLogger.db, 'executeRaw');

  const res = await dbLogger.getLatestFolderID();

  expect(executeRawMock).toHaveBeenCalled();
  expect(res).toBe('folder 3');
});

test('should insert latest folder id', async () => {
  const insertRawMock = jest.spyOn(dbLogger.db, 'insert');

  const res = await dbLogger.insertToUpdateSummary('folderID1');

  expect(insertRawMock).toHaveBeenCalledWith('update_history', {'id': 'NULL', 'folder_id': `'folderID1'`, 'updated_at': 'current_timestamp()'});
  expect(res).toBe('success');
});

test('should update latest update_at', async () => {
  const executeRawMock = jest.spyOn(dbLogger.db, 'executeRaw');

  await dbLogger.getLastUpdateDate();

  expect(executeRawMock).toHaveBeenCalled();
});

afterAll(() => {
  realDB.endConnection();
});
