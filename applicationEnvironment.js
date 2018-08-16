const path = require('path');

const config = {
    cwd: path.join(__dirname, 'app'),
    modulePaths: [
        '.',
        'moduleWrappers',
        'types'
    ],
    allowOverride: false,
    eagerLoad: false,
    errorOnModuleDNE: true
};

module.exports = require('dject').new(config);