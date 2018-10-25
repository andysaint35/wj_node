
'use strict';

const md5 = require('md5');
const qs = require('qs');
const redis = require('./redis.service');
const client = new redis.Client();
const appIds = ['haha'];
const config = require('../config/environment');
//日志
//const logger = require('../logger/winston')('sign');

const DURATION = 300000; // 5min
const STRINGIFY_OPTIONS = {
  sort: alphabeticalSort,
  arrayFormat: 'repeat',
  allowDots: true,
  encode: true
};

function alphabeticalSort(a, b) {
  return a.localeCompare(b);
}

function authFail(req, res, next, msg) {
  let method = req.method.toUpperCase();
  let data = req.method === 'POST' ? JSON.stringify(req.body) : '';
  let isProd = process.env.NODE_ENV === 'prod';

 // logger.error(msg, method, req.url, data);
 // logger.error(JSON.stringify(req.headers));

  if (config.signAuthIgnore) {
    if (!isProd) {
      res.set('signAuth', msg);
    } else if(/common\/check/.test(req.url)) { // force auth for `/common/check` api
      res.status(403).end();
      return;
    }

    next();
  } else {
    if (isProd) {
      msg = 'Go away';
    }

    res.status(403).send(msg).end();
  }
}

function getSignature(params) {
  let clone = Object.assign({}, params);
  let appKey = md5(clone.appId).substr(7, 16);
  delete clone.appId;
  delete clone.signature;
  
  let str = qs.stringify(clone, STRINGIFY_OPTIONS) + appKey;
  let sign = md5(str);

  return {
    str: str,
    sign: sign
  };
}

function auth() {
  return function (req, res, next) {
    /**
     * disable auth for:
     * index
     * api-doc
     * common/current api
     * wechat/signature api
     * mzjk/loan/reapply - tmp disable
     */
    if (/^\/(api-doc|common\/current|wechat\/signature|mzjk\/loan\/reapply|$)/.test(req.url)) {
      next();
      return;
    }

    const method = req.method.toUpperCase();
    const timestamp = Date.now();

    let params = method === 'GET' ? req.query : req.body;
    let msg;
    switch (true) {
      case !+params.timestamp:
        msg = '[1]timestamp required';
        break;
      case !params.noncestr:
        msg = '[2]noncestr required';
        break;
      case !params.signature:
        msg = '[3]signature required';
        break;
      case !params.appId:
        msg = '[4]appId required';
        break;
      case !appIds.find(id => params.appId == id):
        msg = '[5]invalid appId';
        break;
      case Math.abs(timestamp - params.timestamp) >= DURATION:
        msg = '[6]timestamp expired';
        res.set('sign', 'te');
        break;
    }

    if (msg) {
      authFail(req, res, next, msg);
      return;
    }

    let signInfo = getSignature(params);
    let sSignature = signInfo.sign;
    let cSignature = params.signature;

    if (cSignature === sSignature) {
      client.get(cSignature, (err, replies) => {
        if (replies) {
          msg = '[7]signature exists';
          authFail(req, res, next, msg);
        } else {
          client.set(cSignature, 1, 'EX', DURATION);
          delete params.timestamp;
          delete params.noncestr;
          delete params.signature;
          delete params.appId;
          next();
        }
      });
    } else {
      // msg = `[8]signature mismatch
      // expected => ${sSignature}
      // actual => ${cSignature}
      // serial => ${signInfo.str}`;
      msg = '[8]signature mismatch';
      
      authFail(req, res, next, msg);
    }
  };
}

module.exports = auth;