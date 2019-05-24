/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const mocha = require('mocha');
const request = require('supertest');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const assert = require('assert');

const { describe } = mocha;
let app = null;
let server = null;

const mongodbUrl = 'mongodb://localhost/happyfox_test';

before(async () => {
  await mongoose.connect(mongodbUrl, { useNewUrlParser: true });
  mongoose.connection.db.dropDatabase();
  requireDir('../app/models/');
  app = require('../app/app');
  server = app.listen('127.0.0.1:3003');
});


describe('GET /contacts', function () {
  it('Displays all contacts', function () {
    return request(app)
      .get('/api/contacts')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        assert(response.body.data.records.length === 0, 'Length of data is zero');
      });
  });
});

describe('POST /contacts', function () {
  it('Creates new contact with name and email', function () {
    return request(app)
      .post('/api/contacts')
      .send({ name: 'John Doe', email: [{ content: 'johndoe@gmail.com', tag: 'work' }] })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        assert(Object.keys(response.body.data).includes('id'), 'Returns new resource id');
      });
  });

  it('Creates new contact with name and email and phone', function () {
    return request(app)
      .post('/api/contacts')
      .send({ name: 'John Doe', email: [{ content: 'johndoe@gmail.com', tag: 'work' }], phone: [{ content: '123456789', tag: 'personal' }] })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        assert(Object.keys(response.body.data).includes('id'), 'Returns new resource id');
      });
  });

  it('Throws form errors when creating contact without required fields', function () {
    return request(app)
      .post('/api/contacts')
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        assert(Object.keys(response.body).includes('errors'), 'Contains form errors');
      });
  });

  it('Throws form errors when creating contact with only name', function () {
    return request(app)
      .post('/api/contacts')
      .send({ name: 'John Doe' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        assert(Object.keys(response.body).includes('errors'), 'Contains form errors');
      });
  });

  it('Throws form errors when creating contact with wrong email or phone tag', function () {
    return request(app)
      .post('/api/contacts')
      .send({ name: 'John Doe', email: [{ content: 'johndoe@test.com', tag: 'xyz' }], phone: [{ content: '12356789', tag: 'xyz' }] })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        assert(Object.keys(response.body).includes('errors'), 'Contains form errors');
      });
  });
});

after(async function (done) {
  try {
    if (server) {
      server.close();
      mongoose.connection.close();
    }
    return done();
  } catch (e) {
    return done();
  }
});
