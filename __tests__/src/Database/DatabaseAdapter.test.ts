/* eslint-disable max-len,require-jsdoc */
console.log = () => null; // disable logs

import dotenv from 'dotenv';
dotenv.config();

import DatabaseAdapter from '../../../src/Database/DatabaseAdapter';

/* jest.mock('../../../src/Database/MySQLDatabase');

const mockConnect = jest.fn();
MySQLDatabase.prototype.connect = mockConnect;
mockConnect.mockReturnValue(Promise.resolve('DB Connection Mocked!'));*/

test('Should be a singleton', async () => {
  const databaseAdapter1: DatabaseAdapter = await new DatabaseAdapter().init();
  const databaseAdapter2: DatabaseAdapter = await new DatabaseAdapter().init();

  expect(databaseAdapter1).toBe(databaseAdapter2);
  databaseAdapter1.endConnection();
  // expect(mockConnect).toHaveBeenCalled();
});
