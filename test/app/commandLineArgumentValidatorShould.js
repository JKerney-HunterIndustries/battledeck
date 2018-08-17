'use strict';

describe('commandLineArgumentValidator should', function () {
    const applicationEnvironment = require('../../applicationEnvironment');
    const testEnvironment = require('../testEnvironment');

    testEnvironment.build('approvalsConfigFactory');

    const sinon = testEnvironment.build('sinon');
    const { asInformationString } = testEnvironment.build('objectInformation');
    const { assert } = testEnvironment.build('chai');

    const { asBasicInformationString } = testEnvironment.build('object-information');
    const resultBuilderFactory = testEnvironment.build('approval-result-factory');
    const spyFactory = testEnvironment.build('spyFactory');

    let testContext;
    let commandLineArgumentValidator;
    let argumentValuesFake;
    let loggerFake;
    let commandLineArgsFake;
    let processControlFake;

    const valueFake = {
        arg1: { valid: true, name: 'arg1Name', value:'arg1Value' },
        arg2: { valid: false, name: 'arg2Name', value:'arg2Value' }
    };

    beforeEach(function () {
        testContext = applicationEnvironment.new();

        loggerFake = {
            __name: 'logger',
            log: sinon.spy()
        };

        argumentValuesFake = {
            __name: 'arguments',
            valid: true,
            value: valueFake
        };

        commandLineArgsFake = {
            __name: 'command-line-args',
            getArgs: sinon.spy(() => argumentValuesFake),
            buildUsageInfo: sinon.spy(() => { })
        };

        processControlFake = {
            __name: 'process',
            exit: sinon.spy()
        };

        testContext.register(() => 'ver.sio.n', 'appVersion');
        testContext.register(() => commandLineArgsFake, 'commandLineArgs');
        testContext.register(() => loggerFake, 'logger');
        testContext.register(() => processControlFake, 'processControl');

        commandLineArgumentValidator = testContext.build('commandLineArgumentValidator');
    });

    it('validatesCommandLineArguments', function () {
        let result = commandLineArgumentValidator();
        
        assert.equal(valueFake, result);
    });

    it('handle bad arguments', function() {
        argumentValuesFake.valid = false;
        commandLineArgumentValidator();
        let resultBuilder = resultBuilderFactory();
        resultBuilder.addFakeServices(
            [
                commandLineArgsFake,
                loggerFake,
                processControlFake
            ]
        );

        this.verify(asBasicInformationString(resultBuilder.getResult()));
    });



    // it('Runs Index', function() {
    //     const main = require('./test-utils/approvals-config');
    //     //Do something
    //     //main();
    //     assert.isOk(false);
    // });
});
