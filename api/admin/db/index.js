
var express = require('express');
var router = express.Router();
const controller =  require('./db.controller');

router.post('/add', controller.add);
router.get('/get', controller.get);
router.get('/getFullScoreList', controller.getFullScoreList);

router.get('/buildcsv', controller.buildcsv);

module.exports = router;
