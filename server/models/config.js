// Provide interface to access persistsed configuration

var db_helper = require('./db_helper');
var uuid = require('uuid/v4');
var debug = require('debug')('apollochain:debug');

const collection_name = 'config';

exports.get = function(name, cb) {
  db_helper.connect(function(err, cli, db) {
    if (err) return cb(err);

    debug('Try to get the value of config "' + name + '"');

    db.collection(collection_name).findOne({_id: name}, function(err, result) {
      cli.close();
      cb(err, result);
    });
  });
}

exports.set = function(name, value, cb) {
  db_helper.connect(function(err, cli, db) {
    if (err) return cb(err);

    let config = {
      _id: name,
      value: value,
    };

    db.collection(collection_name).save(config, function(err, result) {
      cli.close();
      cb(err, result);
    });
  });
}
