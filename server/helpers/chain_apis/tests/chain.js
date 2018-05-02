// Test command for BTC: curl -d "coin=btc&amount=100000&addr=C2ZMZNtJ97YUsfWhGB8hh8CP2pPkdD9czc&apl_amount=234&apl_addr=fjsdkjk321" -X POST http://localhost:3000/preico/api/transactions
// Test receiver wallet address: CE5HED36PtVmX4GXTovJNQeKotMmJn68at
// var coin_api = require.main.require('../helpers/chain_apis/btc');

// Test command for ETH: curl -d "coin=eth&amount=1000000&addr=0xdF8e23b8609E06D781a11b6E6c107ee79EAf4fD7&apl_amount=1000000&apl_addr=fjsdkjk321" -X POST http://localhost:3000/preico/api/transactions
// Test receiver wallet address: 0x98D10B07D9Cb5bDBE126a18EAf4F087F2526Fa11
// var chain_api = require.main.require('../helpers/chain_apis/eth');

// Test command for SKY: curl -d "coin=sky&amount=9030&addr=MbZvwdXHnMUZ1eUFxNDqxPEEHkkffKgq2F&apl_amount=1000000&apl_addr=fjsdkjk321" -X POST http://localhost:3000/preico/api/transactions
// Test receiver wallet address: MbZvwdXHnMUZ1eUFxNDqxPEEHkkffKgq2F
var chain_api = require.main.require('../helpers/chain_apis/sky');

chain_api.update(true, function (err, result) {
  if (err)
    console.log('Error: ' + err);

  console.log(result);
})
