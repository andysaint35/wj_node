/**
 * Main application file
 */

'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const requestIp = require('request-ip');
const randomIp = require('random-ip');
const ua = require('express-useragent');
const signAuth = require('./services/sign-auth.service');
const config = require('./config/environment');
const xtpl = require('xtpl');
const app = express();
// replace native Promise for request-context
global.Promise = require('bluebird');

const contextService = require('request-context');
app.use(contextService.middleware('request'));

// HTTP request logger setup
app.use(require('./logger/morgan'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'xtpl');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// enable CORS
app.use(cors());
app.use(ua.express());
app.use(requestIp.mw());
// app.use(function (req, res, next) {
//   if (req.clientIp === '::1') { // local test, do mock
//     req.clientIp = randomIp('218.1.33.190', 16, 24);
//   } else if (/^::ffff:/.test(req.clientIp)) { // only support ipv4 now
//     req.clientIp = req.clientIp.replace(/^::ffff:/, '');
//   }
//   next();
// });
// signature auth
if (config.signAuth) {
  app.use(signAuth());
}

//errorHandler
if (app.get('env') === 'prod' || app.get('env') === 'pre') {
  app.use((req, res, next)=> {
    let json = res.json;
    res.json = result=> {
      if (result && result.errorCode === '9999999') {
        result.errorMessage = '系统繁忙';
      }
      json.call(res, result);
    };
    next();
  });
}
// routing entrance config
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin/index'));
app.use('/wechat', require('./routes/wechat'));



app.use('/api/wechat', require('./api/wechat/wechat.service').setOa(), require('./api/wechat'));
app.use('/api/admin', require('./api/admin'));

// serve api doc
// if (app.get('env') !== 'prod') {
//   app.use('/api-doc', express.static(path.join(__dirname, 'apidoc')));
//   app.get('/jwt/:userId?', (req, res)=> {
//     let userId = req.params.userId || 2075561;
//     let tokenInfo = require('./services/auth.service').signToken({
//       userId: userId,
//       sessionId: 1
//     });
//     res.send(tokenInfo.jwt);
//   });
//   app.get('/ua', (req, res)=> {
//     res.json(req.useragent);
//   });
// }



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function (err, req, res, next) {
  const isProd = app.get('env') === 'prod';
  
  if (err.name === 'JsonSchemaValidation') {
    // Set a bad request http response status or whatever you want
    res.status(400);

    // Format the response body however you want
    const responseData = {
      statusText: 'Bad Request',
      jsonSchemaValidation: true,
      validations: err.validations // All of your validation information
    };
  
    res.json(responseData);
  } else {
    const status = err.status || err.response && err.response.status || 500;
    
    res.status(status);
  
    if(isProd) {
      res.end();
    } else {
      err.status = status;
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  }

});

module.exports = app;