var config_db = require.main.require('../models/config');
var debug = require('debug')('apollochain:debug');
var util = require('util');
var http_helper = require.main.require('../helpers/http_helper');

/**
 * Get last checked block height
 * If it's never checked before and url is not null, get latest block height instead
 */
exports.getLastCheckedBlockHeight = function(coin, url, cb) {
  config_db.get('last_checked_block_height', function(err, records) {
    if (err) return cb(err, records);

    debug(util.format('The LastCheckedBlockHeight of "%s" stored in database is ', coin) + (records ? records.value[coin] : null));

    if (records && records.value && records.value[coin]) {
      return cb(null, records.value[coin]);
    }

    if (url) {
      getLatestBlockHeight(url, cb);
    } else {
      // return 0 as block height
      cb(null, 0);
    }
  });
}

function getLatestBlockHeight(url, cb) {
  debug('Try to get latest block height. Url is ' + url);

  http_helper.get(url, function(err, res, data) {
    if (err) return cb(err);
    if (res.statusCode != 200) return cb('unexpected response', data.error);

    debug('getLatestBlockHeight: height is ' + (data ? data.height : null));
    cb(data.height ? null : 'Block height is incorrect', data.height);
  });
}

exports.updateLatestBlockHeight = function(coin, blockHeight) {
  config_db.get('last_checked_block_height', function(err, records) {
    if (err) return console.error(err);

    debug('set latest block height of ' + coin + ' to ' + blockHeight);

    if (!records) {
      records = {};
    } else {
      records = records.value;
    }

    records[coin] = blockHeight;

    config_db.set('last_checked_block_height', records, function(err) {
      if (err) return console.error(err);
    });
  });
}

