'use strict';

function appVersion() {
    const { "version": version } = require('../package.json');
    return version.trim();
}

module.exports = appVersion;