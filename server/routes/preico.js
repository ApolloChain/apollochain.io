var express = require('express');
var router = express.Router();
var validator = require('express-validation');
var transaction = require.main.require('../models/transaction');
var transactionValidation = require('./validation/transaction');
var debug = require('debug')('apollochain:debug');

router.post('/api/transactions/', validator(transactionValidation.createTransaction), function(req, res, next) {
  transaction.create(req.body.coin, req.body.amount, req.body.addr, req.body.apl_amount, req.body.apl_addr, req.body.email, function(err, records) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    debug(records);
    res.sendStatus(200);
  });
});

router.get('/api/transactions/:transaction_id/status', function(req, res, next) {
  // a backend service will update transaction status periodically. here we just read database and return.
  transaction.get(req.params.transaction_id, function(err, transaction) {
    if (!transaction) {
      return res.sendStatus(404);
    }

    res.status(200).send({
      status: transaction.status
    })
  });
});

module.exports = router;
