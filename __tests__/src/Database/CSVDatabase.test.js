/* eslint-disable max-len */
const CSVDatabase = require('../../../src/Database/CSVDatabase');
const CaseInformation = require('../../../src/CaseInformation');
const FacilityInformation = require('../../../src/FacilityInformation');
console.log = () => {}; // disable logs
jest.mock('fs');

test('Should not be empty nor undefined', async () => {
  const csvDatabase = await new CSVDatabase(CaseInformation);

  return csvDatabase.get().then(async (data) => {
    expect(data.length).not.toBe(0);
    expect(data.length).not.toBeUndefined();
  });
});

test('Should not be empty nor undefined (2)', async () => {
  const csvDatabase = await new CSVDatabase(FacilityInformation);

  return csvDatabase.get().then(async (data) => {
    expect(data.length).not.toBe(0);
    expect(data.length).not.toBeUndefined();
  });
});

test('Should match length of CaseInformations', async () => {
  const csvDatabase = await new CSVDatabase(CaseInformation);
  return csvDatabase.get().then(async (data) => {
    expect(data.length).toBe(await csvDatabase.getSize());
  });
});

test('Should be true after instantiation', async () => {
  const csvDatabase = await new CSVDatabase(CaseInformation);
  expect(csvDatabase.isConverting).toBeTruthy();
  expect(csvDatabase.assureCSIsLoaded()).resolves.toBeTruthy();
});
