/* eslint-disable max-len,require-jsdoc */
require('dotenv').config();
const DatabaseAdapter = require('../../../src/Database/DatabaseAdapter');
console.log = () => {}; // disable logs

/* jest.mock('../../../src/Database/MySQLDatabase');

const mockConnect = jest.fn();
MySQLDatabase.prototype.connect = mockConnect;
mockConnect.mockReturnValue(Promise.resolve('DB Connection Mocked!'));*/

test('Should be a singleton', async () => {
  const databaseAdapter1 = await new DatabaseAdapter();
  const databaseAdapter2 = await new DatabaseAdapter();

  expect(databaseAdapter1).toBe(databaseAdapter2);
  // expect(mockConnect).toHaveBeenCalled();
});
