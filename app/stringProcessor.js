'use strict';

function stringProcessor(
    appVersion,
    fs
) {
    const variables = {
        version: appVersion
    }

    const tokenNames = Object.keys(variables);

    function replaceTokens(value) {
        var result = value;
        tokenNames.forEach(tokenName => {
            const token = `{${tokenName}}`;
            result = result.replace(token, variables[tokenName]);
        });

        return result;
    }

    function replaceTokensInFile(path) {
        const file = fs.readFileSync(path, { 'encoding': 'utf8' });
        return replaceTokens(file);
    }

    return {
        replaceTokens: replaceTokens,
        replaceTokensInFile: replaceTokensInFile
    };
}

module.exports = stringProcessor;