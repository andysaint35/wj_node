

'use strict';

const axios = require('axios');
const logger = require('../logger/winston')('request');
const uuid = require('uuid/v4');
const contextService = require('request-context');
const config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
const CODE_MAP = require('../config/errorcode.mapping.json');
const IS_PROD_ENV = process.env.NODE_ENV === 'prod';

module.exports = function createInstance(_config) {
  if(_config && _config.serverName) {
    _config.baseURL = config[_config.serverName];
  }
  
  let instanceConfig = Object.assign({
    timeout: 15000,
    headers: {'Content-Type': 'application/json'}
  }, _config);

  let instance = axios.create(instanceConfig);

  // Add a request interceptor
  instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    let traceId = uuid();
    let method = config.method.toUpperCase();
    let params = config.params || '';
    let data = config.data && JSON.stringify(config.data) || '';
    
    // Do not log large request data on prod env
    if(IS_PROD_ENV && Buffer.from(data).length/1024 > 50) { // over 50k
      data = 'DATA_OVER_50K';
    }
    
    // append userId to traceId
    if(config.data && config.data.userId) {
      traceId += '-' + config.data.userId;
    }
  
    config.headers.TraceId = traceId;
    
    // append CAT trace ids
    let cat = contextService.get('request:cat');
    Object.assign(config.headers, cat);
    
    logger.info(method, config.url, traceId, params, data);

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  instance.interceptors.response.use(function (response) {
    // Do something with response data
   // console.log(JSON.stringify(response));
    const traceId = response.config.headers.TraceId;
    let data = JSON.stringify(response.data);
  
    // Do not log large response data on prod env
    if(IS_PROD_ENV && Buffer.from(data).length/1024 > 2) { // over 2k
      if(response.data.data) {
        data = JSON.stringify(Object.assign({}, response.data, {data: 'DATA_OVER_2K'}));
      } else {
        data = 'DATA_OVER_2K';
      }
    }

    logger.info(traceId, data);
    
    // ErrorCode Mapping
    if(!response.data.succeed) {
      response.data.errorMessage = CODE_MAP[response.data.errorCode] || response.data.errorMessage;
    }

    return response;
  }, function (error) {
    // Do something with response error
    let config = error.config;
    let method = config.method.toUpperCase();
    let traceId = config.headers.TraceId;
    let params = config.params || '';
    let data = config.data || '';
    let status = error.response && error.response.status || '';

    logger.error(method, config.url, traceId, params, data, status, error.message);

    return Promise.reject(error);
  });

  return instance;
};

