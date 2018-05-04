var url_module = require('url');

let adapters = {
  'http:': require('http'),
  'https:': require('https'),
};

exports.get = function(url, cb) {
  adapters[url_module.parse(url).protocol].get(url, function(res) {
    let rawData = '';
    res.on('data', function(d) { rawData += d; }); 
    res.on('end', function() {
      try {
        cb(null, res, JSON.parse(rawData));
      } catch (e) {
        cb(e);
      }
    });
  }).on('error', function(e) {
    cb(e);
  });
}
