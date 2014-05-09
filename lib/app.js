/**
 * Module dependencies.
 */
var antenna = require('antenna');


/**
 * Service bus app.
 *
 * This app is used to register listeners that process messages received on a
 * service bus.  The app uses Antenna as a framework, allowing listeners to
 * developed in a familiar style, similar to that of Express.
 */
exports = module.exports = function() {
  return antenna();
}

/**
 * Component annotations.
 */
exports['@singleton'] = true;
exports['@require'] = [];
