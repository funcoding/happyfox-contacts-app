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
        assert(Object.keys(response.body.data).includes('_id'), 'Returns new resource id');
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
        assert(Object.keys(response.body.data).includes('_id'), 'Returns new resource id');
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

describe('GET /contacts/:id', function () {
  it('Creates new contact and fetch by id', async function () {
    const contact = { name: 'John Doe', email: [{ content: 'johndoe@gmail.com', tag: 'work' }] };
    let response = await request(app).post('/api/contacts')
      .send(contact)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    const id = response.body.data._id;
    response = await request(app)
      .get(`/api/contacts/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    return assert(response.body.data.name === contact.name, 'Contact name should match with John Doe');
  });

  it('Throws 422 when provided id is non mongoose id', async function () {
    return request(app)
      .get(`/api/contacts/123`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);
  });

  it('Throws 404 with non existence resource id', async function () {
    return request(app)
      .get(`/api/contacts/${mongoose.Types.ObjectId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
  });
});

describe('DELETE /contacts/:id', function () {
  it('Creates new contact and delete by id', async function () {
    const contact = { name: 'John Doe', email: [{ content: 'johndoe@gmail.com', tag: 'work' }] };
    let response = await request(app).post('/api/contacts')
      .send(contact)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    const id  = response.body.data._id;
    return request(app)
      .delete(`/api/contacts/${id}`)
      .set('Accept', 'application/json')
      .expect(204);
  });

  it('Throws 422 when provided id is non mongoose id', async function () {
    return request(app)
      .delete(`/api/contacts/123`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);
  });

  it('Throws 404 with non existence resource id', async function () {
    return request(app)
      .delete(`/api/contacts/${mongoose.Types.ObjectId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
  });
});

describe('Creates new contact and search contact by wither name or email or phone', function () {
  const contact = { name: 'Jane Doe', email: [{ content: 'janedoe@gmail.com', tag: 'work' }], phone: [{ content: '00000000', tag: 'work' }] };
  it('Create new contact', async function () {
    await request(app).post('/api/contacts')
      .send(contact)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('search by name', async function () {
    const response = await request(app)
      .get(`/api/contacts?search=${contact.name}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    assert(response.body.data.meta.total === 1, 'Total records should be one');
    assert(response.body.data.records[0].name === contact.name, 'Contact name should match with Jane Doe');
  });

  it('search by email', async function () {
    const response = await request(app)
      .get(`/api/contacts?search=${contact.email[0].content}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    assert(response.body.data.meta.total === 1, 'Total records should be one');
  });

  it('search by phone', async function () {
    const response = await request(app)
      .get(`/api/contacts?search=${contact.phone[0].content}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    assert(response.body.data.meta.total === 1, 'Total records should be one');
  });
});

describe('PUT /contacts/:id', function () {
  it('Creates new contact and updates by id', async function () {
    const contact = { name: 'John Doe', email: [{ content: 'johndoe@gmail.com', tag: 'work' }] };
    let response = await request(app).post('/api/contacts')
      .send(contact)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    const id = response.body.data._id;

    const updatedContact = { name: 'John Doe', email: [{ content: 'johndoe@gmail.com', tag: 'personal' }] };
    response = await request(app)
      .put(`/api/contacts/${id}`)
      .send(updatedContact)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    
    response = await request(app)
      .get(`/api/contacts/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    assert(response.body.data.email[0].tag === updatedContact.email[0].tag, `Contact tag should be ${updatedContact.email[0].tag}`);
  });
});

after(async function (done) {
  if (server) {
    server.close();
    mongoose.connection.close();
  }
  return done();
});
