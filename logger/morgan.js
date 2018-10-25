

'use strict';

const FileStreamRotator = require('file-stream-rotator');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const morgan = require('morgan');
const config = require('../config/environment');

const logDirectory = path.join(__dirname, '../log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false,
  max_logs: config.loggerKeepDays + 'd'
});

// morgan date format
morgan.token('date', function() {
  return moment().format('YYYY-MM-DD HH:mm:ss.SS');
});
// correct request ip
morgan.token('remote-addr', function(req, res) {
  return req.clientIp;
});

morgan.format('combined-time', ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"');

if(process.env.NODE_ENV === 'development') {
  module.exports = morgan('dev');
} else {
  module.exports = morgan('combined-time', {stream: accessLogStream});
}
