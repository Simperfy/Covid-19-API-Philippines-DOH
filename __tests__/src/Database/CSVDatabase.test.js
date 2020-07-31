/* eslint-disable max-len */
const CSVDatabase = require('../../../src/Database/CSVDatabase');


test('Should be a singleton', async () => {
  const csvDatabase1 = await new CSVDatabase();
  const csvDatabase2 = await new CSVDatabase();
  expect(csvDatabase1).toBe(csvDatabase2);
});

test('Should match length of CaseInformations', async () => {
  const csvDatabase = await new CSVDatabase();
  expect(csvDatabase.getSize()).resolves.toBe(csvDatabase.CaseInformations.length);
});

test('Should not be empty nor undefined', async () => {
  const csvDatabase = await new CSVDatabase();
  return csvDatabase.get().then(async (data) => {
    expect(data.length).not.toBe(0);
    expect(data.length).not.toBeUndefined();
  });
});

test('Should match length of CaseInformations(2)', async () => {
  const csvDatabase = await new CSVDatabase();
  return csvDatabase.get().then(async (data) => {
    expect(data.length).toBe(await csvDatabase.getSize());
  });
});

test('Should be true after instantiation', async () => {
  const csvDatabase = await new CSVDatabase();
  expect(csvDatabase.isConverting).toBeTruthy();
  expect(csvDatabase.assureCSIsLoaded()).resolves.toBeTruthy();
});
