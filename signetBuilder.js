const signet = require('signet')();

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

signet.defineDuckType('response', {
    writeHead: 'function',
    end: 'function'
});

module.exports = signet;