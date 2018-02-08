const signet = require('signet')();

signet.defineDuckType('commandLineArgument', {
    value: '*',
    valid: 'boolean',
    isError: 'boolean'
});

signet.defineDuckType('response', {
    writeHead: 'function',
    end: 'function'
});

signet.alias('route', 'string');
signet.alias('path', 'string');
signet.alias('html', 'string');
signet.alias('version', 'string');
signet.alias('contentType', 'string');
signet.alias('routerCallback', 'function<response => undefined>');
signet.alias('routeNotFoundCallback', 'function<response, string => undefined>');


module.exports = signet;