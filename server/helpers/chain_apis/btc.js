const wallet_addr = '1Dm5BqpnLFsjvQqVqKUb7UAcTygJtv2dpQ';
const test_wallet_addr = 'CE5HED36PtVmX4GXTovJNQeKotMmJn68at';
const token = '17b57eb9910046258341bc5cdfc7da2c'

const apis = {
  addr_full: 'https://api.blockcypher.com/v1/btc/main/addrs/%s/full?after=%d&token=%s'
}

// use bcwallet to get test coins
const test_apis = {
  addr_full: 'https://api.blockcypher.com/v1/bcy/test/addrs/%s/full?after=%d&token=%s'
}

var util = require('util');
var http_helper = require.main.require('../helpers/http_helper');
var chain_apis_helper = require.main.require('../helpers/chain_apis/common');
var transaction_db = require.main.require('../models/transaction');
var debug = require('debug')('apollochain:debug:btc');

function getWalletAddr(test) {
  return test ? test_wallet_addr : wallet_addr;
}

exports.update = function(test, cb) {
  chain_apis_helper.getLastCheckedBlockHeight('btc', null, function(err, blockHeight) {
    if (err) return cb(err);

    debug('get latest transactions happended on our wallet');

    let addr_full_url = util.format(test ? test_apis.addr_full : apis.addr_full, getWalletAddr(test), blockHeight, token);

    debug('addr_full_url is ' + addr_full_url);

    http_helper.get(addr_full_url, function(err, res, data) {
      if (err) return cb(err);
      if (res.statusCode != 200 || !data.txs) return cb('unexpected response', data.error);
      if (!data.txs.length) {
        // don't increase blockHeight here since we need to retry
        chain_apis_helper.updateLatestBlockHeight('btc', blockHeight);
        debug('transaction length is 0');
        return cb(null, 'transaction length is 0');
      }

      let newBlockHeight = data.txs[0].block_height;
      // increase blockHeight so that we will skip current block height in the future
      chain_apis_helper.updateLatestBlockHeight('btc', newBlockHeight + 1);

      let foundTran = false;
      for (let tran_index = 0; tran_index < data.txs.length; tran_index++) {
        let tran = data.txs[tran_index];
        if (!tran.outputs || !tran.inputs) continue;

        foundTran = true;

        let foundOutput = false;
        let wallet_addr_lowercase = getWalletAddr(test).toLowerCase();
        for (let output_index = 0; output_index < tran.outputs.length; output_index++) {
          let output = tran.outputs[output_index];

          debug('check whether the transaction sent btc to our wallet');

          if (output.script_type != 'pay-to-pubkey-hash' || // only support P2PKH
              output.addresses.length != 1 ||
              output.addresses[0].toLowerCase() != wallet_addr_lowercase) {
            continue;
          }

          foundOutput = true;

          debug('check whether the sender is in our records');

          let foundInput = false;
          for (let input_index = 0; input_index < tran.inputs.length; input_index++) {
            let input = tran.inputs[input_index];
            if (!input.addresses || input.addresses.length != 1) {
              continue;
            }

            foundInput = true;

            debug('check sender ' + input.addresses[0]);

            transaction_db.getUnpaidTransactionsByCoinAddr(input.addresses[0], function(err, records) {
              if (err || !records) return cb(err);

              // check whether the sender sent exact amount of btc
              let updateRecord = false;
              // check latest record first
              for (let record_index = records.length - 1; record_index >= 0; record_index--) {
                let record = records[record_index];
                // there's no need to check confirmation here because we won't send coin to user immediately
                // the unit of input is 10^(-8) btc, while the unit of record is 10^(-6) btc
                debug(util.format('actual amount is %s. recorded amount is %d', output.value, record.amount * 100));
                debug(util.format('actual coin is btc. recorded coin is %s', record.coin));
                if (output.value == record.amount * 100 && record.coin == 'btc') {
                  debug('found matched record');
                  updateRecord = true;
                  return transaction_db.updateTransaction(record._id, {status: transaction_db.transaction_status.done, transaction_hash: tran.hash}, cb);
                }
              }

              if (!updateRecord) return cb(null, 'no matched record')
            });
          }

          if (!foundInput) return cb(null, 'no matched input');
        }

        if (!foundOutput) return cb(null, 'no matched output');
      }

      if (!foundTran) return cb(null, 'no matched transaction');
    });
  });
}
