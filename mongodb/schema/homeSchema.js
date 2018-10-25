const db = require('../db');

let schemaTable = {
  "hahha" : {
    type:"string" ,
    validate: function(v){
      return true;  // /xxxx/.test(v)
    },
    message: '{VALUE} is not  valid '
  },


}
let schema = new db.Schema(schemaTable, {timestamps: true , wtimeout: 10000});



module.exports = schema;



