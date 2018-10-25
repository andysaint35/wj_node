const db = require('../db');

let schemaTable = {
  "name": "string",
  "title": "string"
}
let schema = new db.Schema(schemaTable, {timestamps: true , wtimeout: 10000});

module.exports = schema;