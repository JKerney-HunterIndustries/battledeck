'use strict';

const version = require('./versionService');
const fs = require('fs');


function build() {
    const variables = {
        version: version
    }

    const tokenNames = Object.keys(variables);

    function process(value) {
        var result = value;
        tokenNames.forEach(tokenName => {
            const token = `{${tokenName}}`;
            result = result.replace(token, variables[tokenName]);
        });

        return result;
    }

    function processFile(path) {
        const file = fs.readFileSync(path, { 'encoding': 'utf8' });
        return process(file);
    }

    return {
        process: process,
        processFile: processFile
    };
}


module.exports = build;