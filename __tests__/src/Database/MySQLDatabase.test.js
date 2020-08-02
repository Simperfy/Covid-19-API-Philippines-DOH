/* eslint-disable max-len */
require('dotenv').config();
const MySQLDatabase = require('../../../src/Database/MySQLDatabase');
console.log = () => {}; // disable logs

test('should be singleton', async () => {
  const mySQLDatabase1 = new MySQLDatabase();
  const mySQLDatabase2 = new MySQLDatabase();

  expect(mySQLDatabase1).toBe(mySQLDatabase2);

  mySQLDatabase1.endConnection();
});
