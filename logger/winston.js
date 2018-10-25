

'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const config = require('../config/environment');
const env = process.env.NODE_ENV;

const logDirectory = path.join(__dirname, '../log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const logger = function(type) {
  type = type || 'request';
  
  const logToConsole = new (winston.transports.Console)();
  const logToFile = new DailyRotateFile({
    filename: path.join(logDirectory, type),
    datePattern: '-yyyyMMdd.log',
    timestamp: function() {
      return moment().format('YYYY-MM-DD HH:mm:ss.SS');
    },
    json: false,
    maxDays: config.loggerKeepDays
  });
  
  let transports = [logToFile];
  
  if(env !== 'prod') {
    transports.push(logToConsole);
  }

  return new winston.Logger({
    level: config.loggerLevel,
    transports: transports,
    exitOnError: false
  });
};

module.exports = logger;