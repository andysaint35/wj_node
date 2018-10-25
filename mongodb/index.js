//schema    model = new mongoose.Schema    document = new model
const db = require('./db');

module.exports = function(collections){

  return db.model(collections, require(`./schema/${collections}Schema.js`));
}