'use strict';

describe('commandLineArgs', function () {
    const applicationEnvironment = require('../../applicationEnvironment');
    const testEnvironment = require('../testEnvironment');

    testEnvironment.build('approvalsConfigFactory');

    const sinon = testEnvironment.build('sinon');
    const { asInformationString } = testEnvironment.build('objectInformation');

    let commandArgsFake;
    let argsReturnFake;
    let isValidPathFake;

    let commandLineArgs;

    beforeEach(function () {
        let testContext = applicationEnvironment.new();

        argsReturnFake = {
            thing: {}
        };

        commandArgsFake = sinon.spy(function () {
            return argsReturnFake;
        });

        isValidPathFake = sinon.spy();

        testContext.register(() => commandArgsFake, 'commandArgs');
        testContext.register(() => asInformationString, 'commandLineUsage');
        testContext.register(() => isValidPathFake, 'isValidPath');
        testContext.register(() => null, 'fs');
        testContext.register(() => null, 'path');

        commandLineArgs = testContext.build('commandLineArgs');
    });

    describe('getArgs should', function () {
        it('return valid arguments', function () {
            let result = commandLineArgs.getArgs();

            this.verify(asInformationString(result));
        });

        it('return invalid when arguments are invalid', function () {
            argsReturnFake.badThing = { valid: false };
            let result = commandLineArgs.getArgs();

            this.verify(asInformationString(result));
        });

        it('return an error when there is a problem', function () {
            argsReturnFake = null;
            let result = commandLineArgs.getArgs();

            this.verify(asInformationString(result));
        });
    });

    describe('buildUsageInfo should', function () {
        it('return help info', function () {
            let info = commandLineArgs.buildUsageInfo('myVersion');

            this.verify(info);
        });
    });
});