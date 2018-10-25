/**
 * Created by Hom on 12/20/16.
 */

'use strict';

// stb specific configuration
// =================================
module.exports = {
  // logger level
  loggerLevel: process.env.LOGGER_LEVEL || 'info',

  // Server port
  port: process.env.PORT || 1990,

  // Codis Server
  codis: {
    host: '192.168.3.111',
    port: 29000,
    password: 'redis'
  },

  // Signature Auth
  signAuth: false,
  signAuthIgnore: false

};