/* eslint-disable no-undef */
/* eslint-disable max-len,require-jsdoc */

import dotenv from 'dotenv';

import DatabaseAdapter from '../../../src/Database/DatabaseAdapter';

// disable logs
console.log = () => null;
dotenv.config();

test('Should be a singleton', async () => {
  const databaseAdapter1: DatabaseAdapter = await new DatabaseAdapter().init();
  const databaseAdapter2: DatabaseAdapter = await new DatabaseAdapter().init();

  expect(databaseAdapter1).toBe(databaseAdapter2);
  databaseAdapter1.endConnection();
});
