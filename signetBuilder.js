const signet = require('signet')();

signet.alias('response', '*');
signet.alias('filename', 'string');
signet.alias('onNoSuchFile', 'function<response, filename => undefined>');
signet.alias('tryToHostFile', 'function<response, filename => undefined>');

module.exports = signet;