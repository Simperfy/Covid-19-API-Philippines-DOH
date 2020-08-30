/* eslint-disable max-len,require-jsdoc */
import dotenv from 'dotenv';
dotenv.config();

import DatabaseAdapter from '../../../src/Database/DatabaseAdapter';
console.log = () => null; // disable logs

/* jest.mock('../../../src/Database/MySQLDatabase');

const mockConnect = jest.fn();
MySQLDatabase.prototype.connect = mockConnect;
mockConnect.mockReturnValue(Promise.resolve('DB Connection Mocked!'));*/

test('Should be a singleton', async () => {
  const databaseAdapter1 = await new DatabaseAdapter();
  const databaseAdapter2 = await new DatabaseAdapter();

  expect(databaseAdapter1).toBe(databaseAdapter2);
  databaseAdapter1.endConnection();
  // expect(mockConnect).toHaveBeenCalled();
});
