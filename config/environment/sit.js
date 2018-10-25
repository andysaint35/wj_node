/**
 * Created by Hom on 12/20/16.
 */

'use strict';

// sit specific configuration
// =================================
module.exports = {
  // logger level
  loggerLevel: process.env.LOGGER_LEVEL || 'info',

  // Server port
  port: process.env.PORT || 19000,

  // Codis Server
  // codis: {
  //   host: '192.168.4.53',
  //   port: 29000,
  //   password: 'redis'
  // },
  

  // Signature Auth
  signAuth: true,
  signAuthIgnore: false
};