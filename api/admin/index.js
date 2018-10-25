// api

var express = require('express');
var router = express.Router();
const db = require('./db');

/* GET home page. */
router.use('/db', db);




module.exports = router;
