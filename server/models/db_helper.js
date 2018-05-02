var mongo = require('mongodb').MongoClient;
var config = require.main.require('../config');

exports.connect = function(cb) {
  mongo.connect(config.db.mongodb.uri, function(err, cli) {
    if (err) return cb(err); 

    let db = cli.db(config.db.mongodb.database);
    cb(null, cli, db);
  })
}
