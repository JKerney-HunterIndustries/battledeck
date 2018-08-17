'use strict';

describe('logger', function () {
    const applicationEnvironment = require('../../applicationEnvironment');
    const testEnvironment = require('../testEnvironment');

    testEnvironment.build('approvalsConfigFactory')();

    const sinon = testEnvironment.build('sinon');
    const { asInformationString } = testEnvironment.build('objectInformation');
    const { assert } = testEnvironment.build('chai');

    let testContext;

    beforeEach(function () {
        testContext = applicationEnvironment.new();
    });

    // it('Runs Index', function() {
    //     const main = require('./test-utils/approvals-config');
    //     //Do something
    //     //main();
    //     assert.isOk(false);
    // });
});
