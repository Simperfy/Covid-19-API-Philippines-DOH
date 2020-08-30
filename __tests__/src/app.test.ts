/* eslint-disable max-len */
import request from 'supertest';
// disable logs
import app from '../../src/app';

console.log = () => null;
jest.mock('../../src/Database/DatabaseAdapter');

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
