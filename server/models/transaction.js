var db_helper = require('./db_helper');
var uuid = require('uuid/v4');

const collection_name = 'transaction';

const transaction_status = {
  unpaid: 0,
  done: 1
}

exports.transaction_status = transaction_status;

/**
 * Create a transaction.
 *
 * Unit stored in database:
 *  - BTC: bit, which is 10^(-6) btc
 *  - ETH: mether, which is 10^(-6) eth
 *  - SKY: 10^(-1) SKY
 */
exports.create = function(coin, amount, addr, apl_amount, apl_addr, email, cb) {
  db_helper.connect(function(err, cli, db) {
    if (err) return cb(err);

    let transaction = {
      _id: uuid(),
      coin: coin,
      amount: amount,
      addr: addr.toLowerCase(),
      apl_amount: apl_amount,
      apl_addr: apl_addr.toLowerCase(),
      email: email.toLowerCase(),
      status: transaction_status.unpaid,
      create_time: new Date()
    };

    db.collection(collection_name).insert(transaction, function(err, result) {
      if (err && err.code == 11000) {
        // duplicate key error, which should be very corner since the id is uuid
        // but if it happens, we regenerate uuid and retry once
        transaction._id = uuid();
        return db.collection(collection_name).insert(transaction, function(err, result) {
          cli.close();
          cb(err, result);
        });
      }

      cli.close();
      cb(err, result);
    });
  });
}

exports.get = function(transaction_id, cb) {
  db_helper.connect(function(err, cli, db) {
    if (err) return cb(err);

    db.collection(collection_name).findOne({_id: transaction_id}, {status: 1}, function(err, result) {
      cli.close();
      cb(err, result);
    });
  });
}

exports.getUnpaidTransactionsByCoinAddr = function(coin_addr, cb) {
  db_helper.connect(function(err, cli, db) {
    if (err) return cb(err);

    db.collection(collection_name).find({addr: coin_addr.toLowerCase(), status: transaction_status.unpaid})
      .toArray(function(err, result) {
        cli.close();
        cb(err, result);
      });
  });
}

exports.updateTransaction = function(transaction_id, newValues, cb) {
  db_helper.connect(function(err, cli, db) {
    if (err) return cb(err);

    db.collection(collection_name).update({_id: transaction_id}, {$set: newValues}, function (err, result) {
      cli.close();
      return cb(err, err ? result : 'transaction updated');
    });
  });
}
