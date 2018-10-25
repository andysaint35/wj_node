
'use strict';

var express = require('express');
var controller = require('./wechat.controller');
var userController = require('./user.controller.js');
var service = require('./wechat.service.js');
var validate = require('express-jsonschema').validate;

var router = express.Router();

/**
 * @api {get} /wechat/appid 获取appid
 * @apiName appid
 * @apiGroup Wechat
 *
 * @apiParam {String="nonobank","mxd","unifi","mzqbj"} type 公众号别名
 *
 * @apiSuccess {String} appId 公众号appId
 *
 * @apiSuccessExample {json} Success-Response (example):
 *      HTTP/1.1 200 OK
 *      {
 *        "appId": "wx516ea2a122292abc"
 *      }
 *
 * @apiUse WeChatError
 */
router.get('/appid', controller.appId);
router.post('/appid', controller.appId);

/**
 * @api {get} /wechat/signature 获取签名信息
 * @apiName signature
 * @apiGroup Wechat
 * @apiDescription 用于初始化微信分享接口
 *
 * @apiParam {String="nonobank","mxd","unifi","mzqbj"} type 公众号别名
 * @apiParam {String} url 当前页面链接
 *
 * @apiSuccess {String} appId 公众号appId
 * @apiSuccess {Number} timestamp 时间戳
 * @apiSuccess {String} nonceStr 随机字符串
 * @apiSuccess {String} signature 签名
 *
 * @apiSuccessExample {json} Success-Response (example):
 *      HTTP/1.1 200 OK
 *      {
 *        "appId": "wx516ea2a122292abc",
 *        "timestamp": 1482821112,
 *        "nonceStr": "oQ1sTGJ0dwrl1mtv",
 *        "signature": "0fd667758ae974cc7e8100ee68497aebc4c09845"
 *      }
 *
 * @apiUse WeChatError
 */
router.get('/signature', validate({query: require('./schema/signature.schema.json')}), service.getTicket(), controller.signature);
router.post('/signature', validate({body: require('./schema/signature.schema.json')}), service.getTicket(), controller.signature);

/**
 * @api {get} /wechat/access_token 获取access_token及openid
 * @apiName access_token
 * @apiGroup Wechat
 * @apiDescription 用于网页授权，获取用户的openid
 *
 * @apiParam {String="nonobank","mxd","unifi","mzqbj"} type 公众号别名
 * @apiParam {String} code 授权成功之后url返回的code
 *
 * @apiSuccess {String} access_token 网页授权接口调用凭证
 * @apiSuccess {Number} expires_in access_token接口调用凭证超时时间，单位（秒）
 * @apiSuccess {String} refresh_token 用户刷新access_token
 * @apiSuccess {String} openid 用户唯一标识，请注意，在未关注公众号时，用户访问公众号的网页，也会产生一个用户和公众号唯一的OpenID
 * @apiSuccess {String} scope 用户授权的作用域，使用逗号（,）分隔
 *
 * @apiUse WeChatError
 */
router.get('/access_token', validate({query: require('./schema/code.schema.json')}), userController.accessToken);
router.post('/access_token', validate({body: require('./schema/code.schema.json')}), userController.accessToken);

/**
 * @api {get} /wechat/userinfo 获取用户信息
 * @apiName userinfo
 * @apiGroup Wechat
 * @apiDescription 用于网页授权之后，拉取用户信息
 *
 * @apiParam {String="nonobank","mxd","unifi","mzqbj"} type 公众号别名
 * @apiParam {String} accessToken 网页授权接口调用凭证
 * @apiParam {String} openId 用户openId
 *
 * @apiSuccess {String} openid 用户的唯一标识
 * @apiSuccess {String} nickname 用户昵称
 * @apiSuccess {String} sex 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
 * @apiSuccess {String} province 用户个人资料填写的省份
 * @apiSuccess {String} city 普通用户个人资料填写的城市
 * @apiSuccess {String} country 国家，如中国为CN
 * @apiSuccess {String} headimgurl 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
 * @apiSuccess {String} privilege 用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
 * @apiSuccess {String} unionid 只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段
 *
 * @apiUse WeChatError
 */
router.get('/userinfo', validate({query: require('./schema/userinfo.schema.json')}), userController.userInfo);
router.post('/userinfo', validate({body: require('./schema/userinfo.schema.json')}), userController.userInfo);

module.exports = router;