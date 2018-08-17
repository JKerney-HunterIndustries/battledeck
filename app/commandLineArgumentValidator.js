'use strict';

function commandLineArgumentValidator(
    appVersion,
    commandLineArgs,
    processControl
) {
    return function validateCommandLineArguments() {
        const myArgsState = commandLineArgs.getArgs();
        const myArgs = myArgsState.value;

        if ((!myArgsState.valid) || myArgsState.isError || myArgs.help) {
            console.log(commandLineArgs.buildUsageInfo(appVersion));
        }

        if (myArgsState.isError) {
            console.log(`\n\nERROR: \n ${myArgs}\n\n`)
        } else if (!(myArgsState.valid)) {
            console.log('\nErrors: \n');
            Object
                .keys(myArgs)
                .filter(k => myArgs[k].valid)
                .forEach(k => console.log(`\n${myArgs[k].name}: ${myArgs[k].value}\n`))
            console.log('\n');
        }

        if (myArgs.version && !myArgs.help) {
            console.log(`battledeck version: ${appVersion}`);
        }

        if ((!myArgsState.valid) || myArgsState.isError || myArgs.help || myArgs.version) {
            processControl.exit();
        }

        return myArgs;
    }
}

module.exports = commandLineArgumentValidator;