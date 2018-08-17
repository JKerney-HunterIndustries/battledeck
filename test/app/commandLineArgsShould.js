'use strict';

describe('commandLineArgs', function () {
    const applicationEnvironment = require('../../applicationEnvironment');
    const testEnvironment = require('../testEnvironment');

    testEnvironment.build('approvalsConfigFactory');

    const sinon = testEnvironment.build('sinon');
    const { asInformationString } = testEnvironment.build('objectInformation');
    const { assert } = testEnvironment.build('chai');

    const resultBuilderFactory = testEnvironment.build('approvalResultFactory');

    let commandArgsFake;
    let commandLineArgs;
    let argsReturnFake;

    beforeEach(function () {
        let testContext = applicationEnvironment.new();

        argsReturnFake = {
            thing: {}
        };

        commandArgsFake = sinon.spy(function () {
            return argsReturnFake;
        });

        testContext.register(() => commandArgsFake, 'commandArgs');
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
});