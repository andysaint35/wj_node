/**
 * Created by Hom on 12/20/16.
 */

'use strict';

// Production specific configuration
// =================================
module.exports = {
  // logger level
  loggerLevel: process.env.LOGGER_LEVEL || 'info',

  // Server port
  port: process.env.PORT || 19000,

  // Codis Server
  // codis: {
  //   host: '172.16.0.175',
  //   port: 29000,
  //   password: 'redis4nCnwriY5gPaGhDSPbG7'
  // },
  dataBaseUrl:'127.0.0.1:27017',
  dataBaseName:'wj',
  // Signature Auth
  signAuth: true,
  signAuthIgnore: false,
  // Signature
  signatures: {
    bbs: '2019Maizijf'
  }
};
