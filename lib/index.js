module.exports = function antenna(id) {
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
