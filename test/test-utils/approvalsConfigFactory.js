'use strict';

function approvalsConfigFactory(path) {
    const approvalsLocation = path.join(__dirname, '../../test/approvals')

    const approvalsConfigFactory = require('approvals-config-factory');
    const approvalsConfig = approvalsConfigFactory.buildApprovalsConfig({
        reporter: 'meld'
    });

    return (
        require('approvals')
            .configure(approvalsConfig)
            .mocha(approvalsLocation)
    );
}

module.exports = approvalsConfigFactory;