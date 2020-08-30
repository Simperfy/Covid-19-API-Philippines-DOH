/* eslint-disable max-len */
console.log = () => null; // disable logs

import fs from '../../../__mocks__/fs';
jest.mock('fs', () => {
  return {
    __esModule: true,
    default: fs,
  };
});

import {csv} from '../../../__mocks__/csvtojson';
jest.mock('csvtojson', () => {
  return {
    __esModule: true,
    default: csv,
  };
});

import CSVDatabase from '../../../src/Database/CSVDatabase';
import CaseInformation from '../../../src/CaseInformation';

import FacilityInformation from '../../../src/FacilityInformation';

test('Should not be empty nor undefined', async () => {
  const csvDatabase: CSVDatabase = await new CSVDatabase().init(CaseInformation);

  return csvDatabase.get().then(async (data) => {
    expect(data.length).not.toBe(0);
    expect(data.length).not.toBeUndefined();
  });
});

test('Should not be empty nor undefined (2)', async () => {
  const csvDatabase = await new CSVDatabase().init(FacilityInformation);

  return csvDatabase.get().then(async (data) => {
    expect(data.length).not.toBe(0);
    expect(data.length).not.toBeUndefined();
  });
});

test('Should match length of CaseInformations', async () => {
  const csvDatabase = await new CSVDatabase().init(CaseInformation);
  return csvDatabase.get().then(async (data) => {
    expect(data.length).toBe(await csvDatabase.getSize());
  });
});

test('Should be true after instantiation', async () => {
  const csvDatabase = await new CSVDatabase().init(CaseInformation);
  expect(csvDatabase.isConverting).toBeTruthy();
  expect(csvDatabase.assureCSIsLoaded()).resolves.toBeTruthy();
});
