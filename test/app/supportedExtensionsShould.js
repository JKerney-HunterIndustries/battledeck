'use strict';

describe('supportedExtensions should', function () {
    const applicationEnvironment = require('../../applicationEnvironment');
    const testEnvironment = require('../testEnvironment');

    testEnvironment.build('approvalsConfigFactory');
    const { asInformationString } = testEnvironment.build('objectInformation');


    let supportedExtensions;

    beforeEach(function () {
        let testContext = applicationEnvironment.new();

        supportedExtensions = testContext.build('supportedExtensions');
    });

    it('contain the supported extensions', function () {
        this.verify(asInformationString(supportedExtensions));
    })
});