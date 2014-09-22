/**
 * Module dependencies.
 */
var uri = require('url');


/**
 * Service bus adapter.
 */
exports = module.exports = function(settings, logger) {
  var config = settings.toObject();
  if (!config.url) { throw new Error('Misconfigured service bus: missing URL'); }
  
  var url = uri.parse(config.url);
  var mod, bus;
  
  switch (url.protocol) {
  case 'amqp:':
    mod = require('antenna-amqp');
    bus = new mod.Bus();
    break;
  default:
    throw new Error('Misconfigured service bus: unsupported protocol "' + url.protocol + '"');
  }
  
  return bus;
}

/**
 * Component annotations.
 */
exports['@singleton'] = true;
exports['@require'] = [ 'settings', 'logger' ];
