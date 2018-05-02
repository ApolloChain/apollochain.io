const wallet_addr = '0x98D10B07D9Cb5bDBE126a18EAf4F087F2526Fa11';
const token = '6QPSNWGIVW93KUNZZDJP72S3K73XK5RVM3';

const apis = {
  account_normal_transaction: 'https://api.etherscan.io/api?module=account&action=txlist&address=%s&startblock=%d&endblock=99999999&sort=asc&apikey=%s'
}

// use MetaMask to get test coins
const test_apis = {
  account_normal_transaction: 'https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=%s&startblock=%d&endblock=99999999&sort=asc&apikey=%s'
}

var util = require('util');
var http_helper = require.main.require('../helpers/http_helper');
var chain_apis_helper = require.main.require('../helpers/chain_apis/common');
var transaction_db = require.main.require('../models/transaction');
var debug = require('debug')('apollochain:debug:eth');
var Long = require('mongodb').Long;

exports.update = function(test, cb) {
  chain_apis_helper.getLastCheckedBlockHeight('eth', null, function(err, blockHeight) {
    if (err) return cb(err);

    debug('get latest transactions happended on our wallet');

    let account_normal_transaction_url =
      util.format(test ? test_apis.account_normal_transaction : apis.account_normal_transaction, wallet_addr, blockHeight, token);

    debug('account_normal_transaction_url is ' + account_normal_transaction_url);

    http_helper.get(account_normal_transaction_url, function(err, res, data) {
      if (err) return cb(err);
      if (res.statusCode != 200) return cb('unexpected response', data);
      if (!data.result.length) {
        // don't increase blockHeight here since we need to retry
        chain_apis_helper.updateLatestBlockHeight('eth', blockHeight);
        debug('transaction length is 0');
        return cb(null, 'transaction length is 0');
      }

      let newBlockHeight = data.result[data.result.length - 1].blockNumber;
      // increase blockHeight so that we will skip current block height in the future
      chain_apis_helper.updateLatestBlockHeight('eth', newBlockHeight + 1);

      let foundTran = false;
      let wallet_addr_lowercase = wallet_addr.toLowerCase();
      for (let tran_index = 0; tran_index < data.result.length; tran_index++) {
        let tran = data.result[tran_index];
        debug('check whether the transaction sent eth to our wallet');

        if (tran.to.toLowerCase() != wallet_addr_lowercase)
          continue;

        foundTran = true;
        debug('check whether the sender is in our records');
        transaction_db.getUnpaidTransactionsByCoinAddr(tran.from, function(err, records) {
          if (err || !records) return cb(err);

          let updateRecord = false;
          for (let record_index = 0; record_index < records.length; record_index++) {
            let record = records[record_index];
            // there's no need to check confirmation here because we won't send coin to user immediately
            // the unit of tran is 10^(-18) eth, while the unit of record is 10^(-6) eth
            let recorded_amount = Long.fromNumber(record.amount).multiply(Long.fromString('1000000000000')); // 10^12
            debug(util.format('actual amount is %s. recorded amount is %s', tran.value, recorded_amount.toString()));
            debug(util.format('actual coin is eth. recorded coin is %s', record.coin));
            if (Long.fromString(tran.value).equals(recorded_amount) && record.coin == 'eth') {
              updateRecord = true;
              return transaction_db.updateTransaction(record._id, {status: transaction_db.transaction_status.done, transaction_hash: tran.hash}, cb);
            }
          }

          if (!foundTran) return cb(null, 'no matched record');
        });
      }

      if (!foundTran) return cb(null, 'no matched transaction');
    });
  });
}

