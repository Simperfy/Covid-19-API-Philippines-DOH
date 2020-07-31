/* eslint-disable max-len */
const DatabaseAdapter = require('../../../src/Database/DatabaseAdapter');

test('Should be a singleton', async () => {
  const databaseAdapter1 = new DatabaseAdapter();
  const databaseAdapter2 = new DatabaseAdapter();
  expect(databaseAdapter1).toBe(databaseAdapter2);
});
