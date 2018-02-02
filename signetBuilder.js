const signet = require('signet')();

signet.alias('response', '*');
signet.alias('filename', 'string');
signet.alias('onNoSuchFile', 'function<response, filename => undefined>');
signet.alias('tryToHostFile', 'function<response, filename => undefined>');

signet.defineDuckType('commandLineArgument', {
    value: '*',
    valid: 'boolean',
    isError: 'boolean'
});

module.exports = signet;