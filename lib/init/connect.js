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


exports = module.exports = function(logger, options) {
  options = options || {};

  return function connect(done) {
    var url = uri.parse(options.url);
    var host = url.hostname;
    var port = url.port || DEFAULT_PORT[url.protocol];
    var exchange = {
      name: options.exchange || 'amq.topic',
      options: {
        type: options.type || 'topic',
        durable: options.durable,
        autoDelete: options.autoDelete,
        confirm: options.confirm
      }
    };
  
    logger.info('Connecting to service bus %s:%d', host, port);
    this.connect({ host: host, port: port, exchange: exchange, listen: options.listen }, function() {
      logger.debug('Connected to service bus %s:%d', host, port);
      done();
    });
    
    // NOTE: By default, if an error is encountered from the service bus it
    //       will be rethrown.  This will cause an `uncaughtException` within
    //       Node and the process will exit.  In accordance with a microservices
    //       architecture, it is expected that a process monitor will detect
    //       this condition and restart as necessary.
    this.on('error', function(err) {
      logger.error('Unexpected error from service bus: %s', err.message);
      logger.error(err.stack);
      throw err;
    });
  }
}

/**
 * Component annotations.
 */
exports['@require'] = [ 'settings', 'logger' ];
