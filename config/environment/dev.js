

'use strict';

// stb specific configuration
// =================================
module.exports = {
  // logger level
  loggerLevel: process.env.LOGGER_LEVEL || 'info',

  // Server port
  port: process.env.PORT || 19000,

  // Codis Server
  // codis: {
  //   host: '192.168.3.111',
  //   port: 29000,
  //   password: 'redis'
  // },
  dataBaseUrl:'localhost:27017',
  dataBaseName:'wj',
  // Signature Auth
  signAuth: true,
  signAuthIgnore: true

};