/* eslint-disable max-len */
const MySQLDatabase = require('../../../src/Database/MySQLDatabase');

test('should output correct insert sql', async () => {
  const mySQLDatabase = new MySQLDatabase();
  expect(await mySQLDatabase.insert('update_history', {'id': 'NULL', 'folder_id': '\'testFolder\'', 'updated_at': 'current_timestamp()'}))
      .toBe(`INSERT INTO update_history (id, folder_id, updated_at) VALUES (NULL, 'testFolder', current_timestamp())`);
});
