const signet = require('signet')();

signet.alias('response', '*');
signet.alias('route', 'string');
signet.alias('path', 'string');
signet.alias('contentType', 'string');
signet.alias('routerCallback', 'function<* => undefined>');
signet.alias('routeNotFoundCallback', 'function<*, string => undefined>');


signet.defineDuckType('commandLineArgument', {
    value: '*',
    valid: 'boolean',
    isError: 'boolean'
});

module.exports = signet;