'use strict';

describe('imageTools', function () {
    const applicationEnvironment = require('../../applicationEnvironment');
    const testEnvironment = require('../testEnvironment');

    testEnvironment.build('approvalsConfigFactory');

    const { expect } = testEnvironment.build('chai');
    const sinon = testEnvironment.build('sinon');
    const { asInformationString } = testEnvironment.build('objectInformation');

    const extentsions = testEnvironment.build('supportedExtensions');


    describe('isAnImagePath should', function () {
        let imageTools;

        beforeEach(function () {
            let testContext = applicationEnvironment.new();

            imageTools = testContext.build('imageTools');
        });

        it('correctly identifies an image extension', function () {
            (
                extentsions
                    .map(e => `this/is/a/path/to/an/image.${e}`)
                    .forEach(path => {
                        let result = imageTools.isAnImagePath(path);

                        expect(result).to.be.true;
                    })
            );
        });

        it('fails if the exstension is not recognized', function () {
            const result = imageTools.isAnImagePath('this/is/a/path/to/an/image.blah');

            expect(result).to.be.false;
        });
    });

    describe('shuffle should', function () {
        const resultBuilderFactory = testEnvironment.build('approvalResultFactory');

        let randomizerFake;

        let imageTools;

        beforeEach(function () {
            let testContext = applicationEnvironment.new();

            randomizerFake = sinon.spy(() => 0.5);

            testContext.register(() => randomizerFake, 'randomizer');
            imageTools = testContext.build('imageTools');
        });

        it('shuffle accordingly', function () {
            let resultbuilder = resultBuilderFactory();

            let result = imageTools.shuffle([1,2,3]);

            resultbuilder.addDatum('random call count', randomizerFake.callCount);
            resultbuilder.addDatum('result', result);

            this.verify(asInformationString(resultbuilder.getResult()));
        });
    });
});