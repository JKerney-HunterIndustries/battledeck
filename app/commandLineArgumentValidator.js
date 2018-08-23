'use strict';

function commandLineArgumentValidator(
    appVersion,
    commandLineArgs,
    logger,
    processControl
) {
    return function validateCommandLineArguments() {
        const myArgsState = commandLineArgs.getArgs();
        const myArgs = myArgsState.value;

        if ((!myArgsState.valid) || myArgsState.isError || myArgs.help) {
            logger.log(commandLineArgs.buildUsageInfo(appVersion));
        }

        if (myArgsState.isError) {
            logger.log(`\n\nERROR: \n ${myArgs}\n\n`)
        } else if (!(myArgsState.valid)) {
            logger.log('\nErrors: \n');
            Object
                .keys(myArgs)
                .filter(k => myArgs[k].valid)
                .forEach(k => logger.log(`\n${myArgs[k].name}: ${myArgs[k].value}\n`));
            logger.log('\n');
        }

        if (myArgs.version && !myArgs.help) {
            logger.log(`battledeck version: ${appVersion}`);
        }

        if ((!myArgsState.valid) || myArgsState.isError || myArgs.help || myArgs.version) {
            processControl.exit();
            return;
        }

        return myArgs;
    }
}

module.exports = commandLineArgumentValidator;