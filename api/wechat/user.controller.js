

'use strict';

var instance = require('../axios')({
  baseURL: 'https://api.weixin.qq.com/sns'
});

module.exports = {
  accessToken: function (req, res, next) {
    instance.get('/oauth2/access_token', {
      params: {
        appid: req.oa.appId,
        secret: req.oa.appSecret,
        code: req.body.code || req.query.code,
        grant_type: 'authorization_code'
      }
    }).then(function (_res) {
      res.send(_res.data);
    }).catch(_err => res.status(_err.response && _err.response.status || 500).end());
  },
  checkAccessToken: function (req, res, next) {
    instance.get('/auth', {
      params: {
        access_token: req.body.accessToken,
        openid: req.body.openId
      }
    }).then(function (_res) {
      res.send(_res.data);
    }).catch(_err => res.status(_err.response && _err.response.status || 500).end());
  },
  refreshAccessToken: function (req, res, next) {
    instance.get('/oauth2/refresh_token', {
      params: {
        appid: req.oa.appId,
        grant_type: 'refresh_token',
        refresh_token: req.body.refreshToken
      }
    }).then(function (_res) {
      res.send(_res.data);
    }).catch(_err => res.status(_err.response && _err.response.status || 500).end());
  },
  userInfo: function (req, res, next) {
    instance.get('/userinfo', {
      params: {
        access_token: req.body.accessToken || req.query.accessToken,
        openid: req.body.openId || req.query.openId,
        lang: 'zh_CN' // zh_TW, en
      }
    }).then(function (_res) {
      res.send(_res.data);
    }).catch(_err => res.status(_err.response && _err.response.status || 500).end());
  }
};