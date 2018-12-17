
var defaults = require('defaults');
var fs = require('fs');
var handlebars = require('handlebars');


/**
 * Read the template.
 */

var source = fs.readFileSync(__dirname + '/crossdomain.xml').toString();
var template = handlebars.compile(source);


/**
 * Expose `crossdomain`.
 */

module.exports = crossdomain;


/**
 * Generate a crossdomain.xml from the provided `options`.
 *
 * @param {Object} options
 *   @property {String} domain
 * @param {String}
 */

function crossdomain (options) {
  if (!options || !options.domain) throw new TypeError('Crossdomain requires domain.');
  options = defaults(options, {
    "allow-http-request-headers-from-headers": "*",
    "site-control-permitted-cross-domain-policies": "all",
    "allow-access-from-domain": "*",
    "allow-access-from-secure": "false"
  });
  return template(options);
}