/* eslint-disable max-len,require-jsdoc */
const DatabaseAdapter = require('../../../src/Database/DatabaseAdapter');
const MySQLDatabase = require('../../../src/Database/MySQLDatabase');
console.log = () => {}; // disable logs

jest.mock('../../../src/Database/MySQLDatabase');

const mockConnect = jest.fn();
MySQLDatabase.prototype.connect = mockConnect;
mockConnect.mockReturnValue(Promise.resolve('DB Connection Mocked!'));

test('Should be a singleton and call connect', async () => {
  const databaseAdapter1 = await new DatabaseAdapter(new MySQLDatabase());
  const databaseAdapter2 = await new DatabaseAdapter(new MySQLDatabase());

  expect(databaseAdapter1).toBe(databaseAdapter2);
  expect(mockConnect).toHaveBeenCalled();
});
