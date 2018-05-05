var Joi = require('joi');

exports.createTransaction = {
  body: {
    coin: Joi.any().valid('btc', 'eth', 'sky').required(),
    amount: Joi.required()
      // coin amount is stored as integer in databse. see models/transaction.js to know the unit of coins.
      // BTC: minimal 0.1 btc, maximum 10 btc
      .when('coin', { is: 'btc', then: Joi.number().integer().min(0.1 * Math.pow(10, 6)).max(10 * Math.pow(10, 6)) })
      // ETH: minimal 1 eth, maximum 100 eth
      .when('coin', { is: 'eth', then: Joi.number().integer().min(1 * Math.pow(10, 6)).max(100 * Math.pow(10, 6)) })
      // SKY: minimal 10 sky, maximum 1000 sky
      .when('coin', { is: 'sky', then: Joi.number().integer().min(10 * Math.pow(10, 1)).max(1000 * Math.pow(10, 1)) }),
    addr: Joi.string().required(),
    apl_addr: Joi.string().required(),
    email: Joi.string().email().required()
  }
}
