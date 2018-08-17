'use strict';

function spyFactory(
    stubcontractorConfig
) {
    return require('spyfactory')(stubcontractorConfig);   
}

module.exports = spyFactory;