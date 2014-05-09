/**
 * Module dependencies.
 */
var uri = require('url');

/**
 * Default port constants.
 */
var DEFAULT_PORT = {
  'amqp:': 5672
};


exports = module.exports = function(app, adapter, settings, logger) {

  return function connection(done) {
    var config = settings.get('connection') || {};
    if (!config.url) { throw new Error('Misconfigured service bus connection: missing URL'); }
    
    // Dispatch messages recieved from the message bus to the application for
    // processing.
    adapter.on('message', app);
    
    var url = uri.parse(config.url);
  
    var host = url.hostname;
    var port = url.port || DEFAULT_PORT[url.protocol];
    var exchange = {
      name: config.exchange || 'amq.topic',
      options: {
        type: config.type || 'topic',
        durable: config.durable,
        autoDelete: config.auto_delete,
        confirm: config.confirm
      }
    };
  
    logger.info('Connecting to message bus...');
    adapter.connect({ host: host, port: port, exchange: exchange, listen: config.listen }, function() {
      logger.info('Connected to message bus');
      done();
    });
  }
}

/**
 * Component annotations.
 */
exports['@require'] = [ '../app', '../adapter', 'settings', 'logger' ];
