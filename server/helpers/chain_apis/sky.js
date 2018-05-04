const wallet_addr = '2ebrypcicoiiLWiJMAKd1DioEEGvzRELj9m';

const apis = {
  transactions: 'http://13.210.32.145:6420/transactions?addrs=%s&confirmed=1',
  uxouts: 'http://13.210.32.145:6420/uxout?uxid=%s'
}

var util = require('util');
var http_helper = require.main.require('../helpers/http_helper');
var chain_apis_helper = require.main.require('../helpers/chain_apis/common');
var transaction_db = require.main.require('../models/transaction');
var debug = require('debug')('apollochain:debug:sky');

exports.update = function(test, cb) {
  // test flag is not used for SKY

  chain_apis_helper.getLastCheckedBlockHeight('sky', null, function(err, blockHeight) {
    if (err) return cb(err);

    debug('get latest transactions happended on our wallet');

    let transactions_url = util.format(apis.transactions, wallet_addr);

    debug('transactions_url is ' + transactions_url);

    http_helper.get(transactions_url, function(err, res, data) {
      if (err) return cb(err);
      if (res.statusCode != 200) return cb('unexpected response', data);

      if (!data ||
          !data.length ||
          // SKY API doesn't support return transactions in given range,
          // so if the last transaction's hash doesn't change, we still think there's no new transaction
          // For SKY, we use transaction id as the blockHeight
          data[data.length - 1].txn.txid == blockHeight
          ) {
        chain_apis_helper.updateLatestBlockHeight('sky', blockHeight);
        debug('transaction length is 0');
        return cb(null, 'transaction length is 0');
      }

      let newBlockHeight = data[data.length - 1].txn.txid;
      // the so-called newBlockHeight is actually transaction id, so we don't +1 for it
      chain_apis_helper.updateLatestBlockHeight('sky', newBlockHeight);

      let foundTran = false;
      for (let tran_index = data.length - 1; tran_index >= 0; tran_index--) {
        let tran = data[tran_index];
        if (tran.txn.txid == blockHeight) {
          // we've checked all new transactions, so break here
          break;
        }

        foundTran = true;

        let foundOutput = false;
        let wallet_addr_lowercase = wallet_addr.toLowerCase();
        for (let output_index = 0; output_index < tran.txn.outputs.length; output_index++) {
          let output = tran.txn.outputs[output_index];

          debug('check whether the transaction sent sky to our wallet');
          if (output.dst.toLowerCase() != wallet_addr_lowercase) {
            continue;
          }

          foundOutput = true;

          debug('check whether the sender is in our records');

          for (let input_index = 0; input_index < tran.txn.inputs.length; input_index++) {
            let input = tran.txn.inputs[input_index];

            let uxouts_url = util.format(apis.uxouts, input);

            debug('uxouts_url is ' + uxouts_url);

            http_helper.get(uxouts_url, function(err, res, data) {
              if (err) return cb(err);
              if (res.statusCode != 200 || !data.owner_address) return cb('unexpected response', data);

              transaction_db.getUnpaidTransactionsByCoinAddr(data.owner_address, function(err, records) {
                if (err || !records) return cb(err);

                // check whether the sender sent exact amount of sky
                let updateRecord = false;
                // check latest record first
                for (let record_index = records.length - 1; record_index >= 0; record_index--) {
                  let record = records[record_index];
                  // there's no need to check confirmation here because we won't send coin to user immediately
                  // the unit of input is 1 sky, while the unit of record is 10^(-1) sky
                  let actualAmount = parseFloat(output.coins) * 10;
                  debug(util.format('actual amount is %s. recorded amount is %d', actualAmount, record.amount));
                  debug(util.format('actual coin is sky. recorded coin is %s', record.coin));
                  if (actualAmount == record.amount && record.coin == 'sky') {
                    debug('found matched record');
                    updateRecord = true;
                    return transaction_db.updateTransaction(record._id, {status: transaction_db.transaction_status.done, transaction_hash: tran.txn.txid}, cb);
                  }
                }

                if (!updateRecord) return cb(null, 'no matched record')
              });
            });
          }
        }

        if (!foundOutput) return cb(null, 'no matched output');
      }

      if (!foundTran) return cb(null, 'no matched transaction');
    });
  });
}
