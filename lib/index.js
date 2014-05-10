exports = module.exports = function antenna(id) {
  var map = {
    'adapter': './adapter',
    'app': './app',
    'boot/connection': './boot/connection'
  };
  
  var mid = map[id];
  if (mid) {
    return require(mid);
  }
};

exports.createAdapter = require('./adapter');
exports.createConnectionBootPhase = require('./boot/connection');
