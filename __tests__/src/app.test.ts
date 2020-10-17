/* eslint-disable max-len */
console.log = () => null; // disable logs

import request from 'supertest';
import DatabaseAdapter from '../../src/Database/__mocks__/DatabaseAdapter';

jest.mock('../../src/Database/DatabaseAdapter', () => {
  return {
    __esModule: true,
    default: DatabaseAdapter,
  };
});


// disable logs
import app from '../../src/app';


jest.setTimeout(300000);
test('GET /api/summary', async () => {
  const res = await request(app).get('/api/summary');

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('data');
  expect(res.body.data).toHaveProperty('fatality_rate');
  expect(res.body.data).toHaveProperty('recovery_rate');
  expect(res.body).toHaveProperty('last_update');
});

test('GET /api/get', async () => {
  const res = await request(app).get('/api/get');

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('data');
  expect(res.body.data).toHaveLength(10000);
  expect(res.body).toHaveProperty('last_update');
  expect(res.body).toHaveProperty('pagination');
  expect(res.body).toHaveProperty('result_count');
  expect(res.body.result_count).toBe(10000);
});

test('GET /api/get?page=1&limit=100', async () => {
  const res = await request(app).get('/api/get?page=1&limit=100');

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('data');
  expect(res.body.data).toHaveLength(100);
  expect(res.body).toHaveProperty('last_update');
  expect(res.body).toHaveProperty('pagination');
  expect(res.body).toHaveProperty('result_count');
  expect(res.body.result_count).toBe(100);
});

test('GET /api/get?page=-1&limit=-1', async () => {
  const res = await request(app).get('/api/get?page=-1&limit=-1');

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('data');
  expect(res.body.data).toHaveLength(0);
  expect(res.body).toHaveProperty('last_update');
  expect(res.body).toHaveProperty('error');
});

test('GET /api/timeline', async () => {
  const res = await request(app).get('/api/timeline');

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('data');
  expect(res.body.data).not.toHaveLength(0);
  expect(res.body.data[0]).toHaveProperty('cases');
  expect(res.body.data[0]).toHaveProperty('date');
  expect(res.body).toHaveProperty('last_update');
});

test('GET /api/top-regions', async () => {
  const res = await request(app).get('/api/top-regions');

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('data');
  expect(res.body.data).not.toHaveLength(0);
  expect(res.body.data[0]).toHaveProperty('region');
  expect(res.body.data[0]).toHaveProperty('cases');
  expect(res.body).toHaveProperty('last_update');
});

test('GET /api/filter/region_res/Region IV-A: CALABARZON', async () => {
  const res = await request(app).get('/api/filter/region_res/Region IV-A: CALABARZON');

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('data');
  expect(res.body.data).toHaveLength(0);
  expect(res.body).toHaveProperty('last_update');
});

test('GET /api/facilities', async () => {
  const res = await request(app).get('/api/facilities');

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('data');
  expect(res.body.data).not.toHaveLength(0);
  expect(res.body).toHaveProperty('last_update');
});

test('GET /api/facilities/summary', async () => {
  const res = await request(app).get('/api/facilities/summary');
  const res2 = await request(app).get('/api/facilities/summary?hospital_name=zafra%20medical%20clinic%20%26%20hosp.');

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('data');
  expect(res.body.data).toHaveProperty('total_facilities');
  expect(res.body.data).toHaveProperty('occupancy_rate');
  expect(res.body.data).toHaveProperty('beds');
  expect(res.body.data).toHaveProperty('equipments');
  expect(res.body).toHaveProperty('last_update');

  expect(res2.status).toBe(200);
  expect(res2.body).toHaveProperty('data');
  expect(res2.body.data).toHaveProperty('total_facilities');
  expect(res2.body.data).toHaveProperty('occupancy_rate');
  expect(res2.body.data).toHaveProperty('beds');
  expect(res2.body.data).toHaveProperty('equipments');
  expect(res2.body).toHaveProperty('last_update');
});
