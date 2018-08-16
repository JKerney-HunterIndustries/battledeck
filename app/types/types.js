'use strict';

// const typeSystem = require('signet')();

function types() {
    return function (typeSystem) {
        typeSystem.defineDuckType('commandLineArgument', {
            value: '*',
            valid: 'boolean',
            isError: 'boolean'
        });

        typeSystem.defineDuckType('response', {
            writeHead: 'function',
            end: 'function'
        });

        typeSystem.alias('route', 'string');
        typeSystem.alias('path', 'string');
        typeSystem.alias('html', 'string');
        typeSystem.alias('version', 'string');
        typeSystem.alias('contentType', 'string');
        typeSystem.alias('routerCallback', 'function<response => undefined>');
        typeSystem.alias('routeNotFoundCallback', 'function<response, string => undefined>');

        return typeSystem;
    }
}

module.exports = types;