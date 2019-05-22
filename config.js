// @author: vinay kumar

'use strict'

const ENVS = [
  'production',
  'development',
  'local',
];

class Config {
  static isValidEnv(hostEnv) {
    return new Promise((resolve, reject) => {
      return ENVS.some(item => item === hostEnv) ? resolve('Valid node environment.') : reject(new Error('Invalid node environment'));
    });
  }

  static init(data) {
    this.port = data.PORT || 3000;
    this.secure = data.SECURE;
    this.mongodbUrl = data.MONGODB_URL;
    this.secret = data.MY_SECRET;
    this.basePath = __dirname;
    return Promise.resolve('Config parameters set.');
  }
}

module.exports = Config;
