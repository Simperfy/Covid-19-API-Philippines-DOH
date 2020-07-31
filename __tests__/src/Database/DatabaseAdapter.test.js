/* eslint-disable max-len */
const DatabaseAdapter = require('../../../src/Database/DatabaseAdapter');

test('Should be a singleton', async () => {
  const databaseAdapter1 = await new DatabaseAdapter();
  const databaseAdapter2 = await new DatabaseAdapter();
  expect(databaseAdapter1).toBe(databaseAdapter2);
});
