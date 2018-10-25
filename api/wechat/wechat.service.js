

'use strict';

const compose = require('composable-middleware');
const oa = require('./../../config/accounts.wechat.json');
const instance = require('../axios')({
  baseURL: 'https://api.weixin.qq.com/cgi-bin'
});

const redis = require('../../services/redis.service');
const client = new redis.Client();

function setOa() {
  return function(req, res, next) {
    var type = req.body.type || req.query.type;
    console.log(type);
    if(oa[type]) {
      req.oa = oa[type];
      next();
    } else {
      next({
        name: 'JsonSchemaValidation',
        message: 'express-jsonschema: Invalid data found',
        validations: {
          body: [{
            property: 'request.body',
            messages: ['requires property "type"']
          }]
        }
      });
    }
  }
}

function getTicket() {
  return compose().use(function (req, res, next) { // set access_token
    let type = req.body.type || req.query.type;

    // cache query
    client.get('token.' + type, function (err, replies) {
      replies = replies && JSON.parse(replies);
      if(replies && replies.expire > Date.now()) {
        req.accessToken = replies.token;
        next();
      } else {
        instance.get('/token', {
          params: {
            grant_type: 'client_credential',
            appid: oa[type].appId,
            secret: oa[type].appSecret
          }
        }).then(function (_res) {
          // save to redis
          client.set('token.' + type, JSON.stringify({
            token: _res.data.access_token,
            expire: Date.now() + _res.data.expires_in*1000
          }));

          req.accessToken = _res.data.access_token;
          req.newToken = true;

          next();
        }).catch(_err => res.status(_err.response && _err.response.status || 500).end());
      }
    });

  }).use(function (req, res, next) { // set ticket
    var type = req.body.type;

    // cache query
    client.get('ticket.' + type, function (err, replies) {
      replies = replies && JSON.parse(replies);
      if(!req.newToken && replies && replies.expire) {
        req.ticket = replies.ticket;
        next();
      } else {
        instance.get('/ticket/getticket', {
          params: {
            access_token: req.accessToken,
            type: 'jsapi'
          }
        }).then(function (_res) {
          if(_res.data.errcode === 0) {
            // save to redis
            client.set('ticket.' + type, JSON.stringify({
              ticket: _res.data.ticket,
              expire: Date.now() + _res.data.expires_in*1000
            }));
            req.ticket = _res.data.ticket;

            next();
          } else {
            res.status(500).send(_res.data);
          }
        }).catch(_err => res.status(_err.response && _err.response.status || 500).end());
      }
    });

  });
}


module.exports = {
  getTicket: getTicket,
  setOa: setOa
};

