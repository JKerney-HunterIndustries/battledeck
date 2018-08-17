'use strict';

function stubcontractorConfig(
    path,
    stubcontractor
) {
    const stubcontractorConfig = {
        cwd: path.join(__dirname, '../../app/'),
        sourceDirectories: [
            './',
            'wrappedModules',
            'types'
        ]
    };

    return stubcontractor(stubcontractorConfig);
}

module.exports = stubcontractorConfig;