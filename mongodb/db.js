const config = require('./../config/environment/index');

const mongoose = require('mongoose');
mongoose.connect(`mongodb://${config.dataBaseUrl}/${config.dataBaseName}`, { useNewUrlParser: true });

const db = mongoose.connection;
const logTitle = '【MONGODB】';

db.on('error', err=>{
	console.error(`${logTitle}数据库链接失败:${err}`);
});

db.on('connecting', ()=>{
	console.log(`${logTitle}数据库正在链接...`);
});

db.once('open', ()=>{
	console.log(`${logTitle}数据库已打开`);
});

db.on('disconnecting', ()=>{
	console.log(`${logTitle}数据库正在断开...`);
});

db.on('disconnected', ()=>{
	console.log(`${logTitle}数据库已断开链接`);
});

db.once('disconnected', ()=>{
	console.log(`${logTitle}数据库已关闭`);
});


module.exports = mongoose;