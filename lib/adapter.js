/**
 * Module dependencies.
 */
var uri = require('url')
  , bootable = require('bootable');


/**
 * Service bus adapter.
 */
exports = module.exports = function(logger, settings) {
  var options = settings.toObject();
  if (!options.url) { throw new Error('Misconfigured service bus: missing URL'); }
  
  var url = uri.parse(options.url);
  var mod, bus;
  
  switch (url.protocol) {
  case 'amqp:':
    mod = require('antenna-amqp');
    bus = new mod.Bus();
    break;
  default:
    throw new Error('Misconfigured service bus: unsupported protocol "' + url.protocol + '"');
  }
  
  // Augument with bootable functionality.
  bus = bootable(bus);
  bus.phase(require('./init/connect')(logger, options));
  
  return bus;
}

/**
 * Component annotations.
 */
exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'settings' ];
