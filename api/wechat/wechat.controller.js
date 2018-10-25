
'use strict';

var randomstring = require("randomstring");
var qs = require('qs');
var sha1 = require('sha1');

module.exports = {
  appId: function (req, res, next) {
    res.json({
      appId: req.oa.appId
    });
  },
  signature: function (req, res, next) {
    var url = req.body.url || req.query.url;

    var obj = {
      jsapi_ticket: req.ticket,
      noncestr: randomstring.generate(16),
      timestamp: ~~(Date.now()/1000),
      url: url.split('#')[0]
    };

    var str = qs.stringify(obj, { encode: false });
    var signature = sha1(str);

    res.json({
      appId: req.oa.appId,
      timestamp: obj.timestamp,
      nonceStr: obj.noncestr,
      signature: signature
    });

  }
};