// @author: vinay kumar

const dotEnv = require('dotenv').config();
const mongoose = require('mongoose');
const requireDir = require('require-dir');

if (dotEnv.error) {
  console.log('.env file not found');
  process.exit(0);
}

const Config = require('./config');

async function checkDBConnection(mongodbUrl) {
  try {
    await mongoose.connect(mongodbUrl, { useNewUrlParser: true });
    return Promise.resolve('DB connection successfull.');
  } catch (e) {
    return Promise.reject(e);
  }
}

Config.isValidEnv(dotEnv.parsed.NODE_ENV || 'local')
  .then((message) => {
    console.log(message);
    return Config.init(dotEnv.parsed);
  })
  .then((message) => {
    console.log(message);
    return checkDBConnection(Config.mongodbUrl);
  })
  .then((message) => {
    console.log(message);
    return requireDir('./app/models/');
  })
  .then((obj) => {
    console.log(`Loaded models ${Object.keys(obj)}`);
    const app = require('./app/app');
    app.listen(Config.port);
    return app;
  })
  .then((message) => {
    console.log(`API server successfully started at port ${Config.port}`);
  })
  .catch((error) => {
    console.log(error);
    process.exit(0);
  });
