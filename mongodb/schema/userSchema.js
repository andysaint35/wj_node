const db = require('../db');


// String      字符串
// Number      数字
// Date        日期
// Buffer      二进制
// Boolean     布尔值
// Mixed       混合类型
// ObjectId    对象ID
// Array       数组

let schemaTable = {
  "name" : { "type":"string" },
  "tel" : { "type":"string" },
  "q1" : { "type": "Mixed"},
  "q2" : { "type": "Mixed"},
  "q3" : { "type": "Mixed"},
  "q4" : { "type": "Mixed"},
  "q5" : { "type": "Mixed"},
  "q6" : { "type": "Mixed"},
  "q7" : { "type": "Mixed"},
  "q8" : { "type": "Mixed"},
  "q9" : { "type": "Mixed"},
  "q10" : { "type": "Mixed"},
  "q11" : { "type": "Mixed"},
  "q12" : { "type": "Mixed"},
  "q13" : { "type": "Mixed"},
  "q14" : { "type": "Mixed"},
  "q15" : { "type": "Mixed"},
  "q16" : { "type": "Mixed"},
  "q17" : { "type": "Mixed"},
  "q18" : { "type": "Mixed"},
  "q19" : { "type": "Mixed"},
  "q20" : { "type": "Mixed"},
  "q21" : { "type": "Mixed"},
  "q22" : { "type": "Mixed"},
  "q23" : { "type": "Mixed"},
  "q24" : { "type": "Mixed"},
  "q25" : { "type": "Mixed"},
  "score" : { "type": "Number"}
}

let schema = new db.Schema(schemaTable, {timestamps: true , wtimeout: 10000});

//methods 只能document 用 (model实例)

//statics 只能model 用 document 不能用

// schema.statics.findById = function (){
//   return {'result':1};
// }

module.exports = schema;