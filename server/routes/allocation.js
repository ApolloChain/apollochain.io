var express = require('express');
var router = express.Router();
var validator = require('express-validation');
var transaction = require.main.require('../models/transaction');
var transactionValidation = require('./validation/transaction');
var debug = require('debug')('apollochain:debug');
var geoip = require('geoip-lite');
var Recaptcha = require('express-recaptcha').Recaptcha;
var config = require.main.require('../config');
var Long = require('mongodb').Long;

var recaptcha = new Recaptcha(config.recaptcha.site_key, config.recaptcha.secret_key);

router.get('/', function(req, res, next) {
  let ipBlocked = false;

  let remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let geo = geoip.lookup(remoteIp);
  if ((geo && (geo.country == 'CN' || geo.country == 'US')) ||
      req.query.ipBlocked // for test purpose
     ) {
    ipBlocked = true;
  }

  res.render('allocation', {
    ipBlocked: ipBlocked,
    captcha: ipBlocked ? null : recaptcha.render()
  });
});

router.post('/api/transactions/', validator(transactionValidation.createTransaction), function(req, res, next) {
  recaptcha.verify(req, function (err, data) {
    if (err) {
      return res.sendStatus(400);
    }

    let amount = Long.fromInt(req.body.amount);
    let apl_amount;
    switch (req.body.coin) {
      case 'btc':
        apl_amount = amount.multiply(Long.fromInt(33000));
        break;
      case 'eth':
        apl_amount = amount.multiply(Long.fromInt(2300));
        break;
      case 'sky':
        apl_amount = amount.multiply(Long.fromInt(85));
        break;
      default:
        // we should not hit this case since we have verified paramter
        return res.sendStatus(500);
    }

    transaction.create(req.body.coin, req.body.amount, req.body.addr, apl_amount, req.body.apl_addr, req.body.email, function(err, records) {
      if (err) {
        return res.sendStatus(500);
      }

      res.status(200).send({
        transactionId: records.ops[0]._id
      });
    });
  })
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
