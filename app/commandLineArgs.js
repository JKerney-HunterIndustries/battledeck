'use strict';

function commandLineArgs(
    commandArgs,
    commandLineUsage,
    isValidPath,
    fs,
    path,
    typeBuilder
) {
    const isUndefined = typeBuilder.isTypeOf('undefined');

    function getParameterType(errorMessage, isItValid, getValue, unknown) {
        try {
            const isValidObject = Boolean(isItValid(unknown));

            return {
                value: isValidObject ? getValue(unknown) : errorMessage,
                valid: isValidObject
            };
        } catch (error) {
            return {
                value: errorMessage,
                valid: false
            }
        }
    }

    function pathType(unknownString) {
        let trimmed = unknownString.trim();
        let isPath = isValidPath(trimmed);
        let err = `Path must be a valid path to a directory. Instead given ${trimmed}`;

        function isValid(value) {
            let info = isPath ? fs.lstatSync(value) : null;

            return Boolean(info) ? info.isDirectory() : false;
        }

        function getPathString(string) {
            let result = string.trim();
            return process.cwd() + '/' + (result.endsWith('\\') || result.endsWith('//') ? result : (result + path.sep));
        }

        return getParameterType(err, isValid, getPathString, unknownString)
    }

    const options = [
        {
            name: 'help',
            alias: '?',
            type: Boolean,
            description: "Shows usage help."
        },
        {
            name: 'path',
            alias: 'p',
            type: pathType,
            defaultOption: true,
            defaultValue: pathType('./'),
            typeLabel: '{italic image_folder_path}',
            description: "The path where images to be used as slides are contained."
        },
        {
            name: 'version',
            alias: 'v',
            type: Boolean,
            description: "Displays the current version of battledeck."
        }
    ];

    function getArgs() {
            function isValidParmeter(unknownType) {
                return (unknownType.valid) || (isUndefined(unknownType.valid));
            }

            try {
                const argumentValues = commandArgs(options);
                const argumentKeys = Object.keys(argumentValues);

                const areValid = argumentKeys
                    .map(k => argumentValues[k])
                    .reduce((accum, b) => accum && isValidParmeter(b), true);

                return {
                    value: argumentValues,
                    valid: areValid,
                    isError: false
                };
            } catch (e) {
                return {
                    value: e.message,
                    valid: false,
                    isError: true
                };
            }
        }

    function buildUsageInfo(version) {
            const sections = [
                {
                    header: 'battledeck - the fun and easy way to do improvational presentations',
                    content: [
                        `Version: ${version}`,
                        'Hosts images in a directory as a random presentation.'
                    ]
                },
                {
                    header: 'Synopsis',
                    content: [
                        'Examples of use:',
                        '',
                        'battledeck',
                        'battledeck imagepath',
                        'battledeck --path imagepath',
                        'battledeck -p imagepath',
                        '',
                        'battledeck --help',
                        'battledeck -?',
                        '',
                        'battledeck --version',
                        'battledeck -v'
                    ]
                },
                {
                    header: 'Options',
                    optionList: options
                },
                {
                    header: 'Other Resources',
                    content: [
                        'Documentation: {underline http://bit.ly/battledeckDocs}',
                        'Project home: {underline https://github.com/JKerney-HunterIndustries/battledeck}'
                    ]
                }
            ];

            return commandLineUsage(sections);
        }

    // console.log(JSON.stringify(getArgs(), null, 4));
    // console.log(buildUsageInfo());

    return {
        getArgs: typeBuilder.enforce(
            '() => commandLineArgument',
            getArgs
        ),
        buildUsageInfo: typeBuilder.enforce(
            'version => string',
            buildUsageInfo
        )
    };
}

module.exports = commandLineArgs;