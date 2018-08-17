const config = {
    cwd: __dirname,
    modulePaths: [
        '.',
        'test-utils',
        '../app',
        '../app/moduleWrappers',
        '../app/types'
    ],
    allowOverride: false,
    eagerLoad: false,
    errorOnModuleDNE: true
};

module.exports = require('dject').new(config);