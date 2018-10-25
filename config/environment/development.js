

'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // logger level
  loggerLevel: 'debug',

  // Server port
  port: process.env.PORT || 1990,

  // Codis Server
  // codis: {
  //   host: '192.168.3.111',
  //   port: 29000,
  //   password: 'redis'
  // },
  dataBaseUrl:'localhost:27017',
  dataBaseName:'wj',
  // Signature Auth
  signAuth: false,
  signAuthIgnore: false
};
