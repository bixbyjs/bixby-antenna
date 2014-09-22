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


exports = module.exports = function(receiver, adapter, settings, logger) {

  return function connection(done) {
    var config = settings.toObject();
    if (!config.url) { throw new Error('Misconfigured service bus: missing URL'); }
    
    // Dispatch messages recieved from the message bus to the application for
    // processing.
    adapter.on('message', receiver);
    
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
  
    logger.info('Connecting to service bus %s:%d', host, port);
    adapter.connect({ host: host, port: port, exchange: exchange, listen: config.listen }, function() {
      logger.debug('Connected to service bus %s:%d', host, port);
      done();
    });
    
    // NOTE: By default, if an error is encountered from the service bus it
    //       will be rethrown.  This will cause an `uncaughtException` within
    //       Node and the process will exit.  In accordance with a microservices
    //       architecture, it is expected that a higher-level monitor will
    //       detect process failures and restart as necessary.
    adapter.on('error', function(err) {
      logger.error('Unexpected error from service bus: %s', err.message);
      logger.error(err.stack);
      throw err;
    });
  }
}

/**
 * Component annotations.
 */
exports['@require'] = [ '../receiver', '../adapter', 'settings', 'logger' ];
