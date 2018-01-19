'use strict';

const signet = require('signet')();
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const isValidPath = require('is-valid-path');
const fs = require('fs');

const isUndefined = signet.isTypeOf('undefined');

const typeName = 'max_slide_count';
signet.alias(typeName, 'formattedString<^[1-9]$|^([1-9][0-9]+)$>');

const verifyInteger = signet.verifyValueType(typeName);

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
        let info = isPath ? fs.lstatSync(trimmed) : null;

        return Boolean(info) ? info.isDirectory() : false;
    }

    return getParameterType(err, isValid, v => v, unknownString)
}

function integer(unknownValue) {
    let err = `Must be a valid integer but recieved ${unknownValue.trim()} instead.`

    return getParameterType(err, () => true, v => Number(verifyInteger(v)), unknownValue);
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
        typeLabel: '[italic]{image_folder_path}',
        description: "The path where images to be used as slides are contained."
        // },
        // {
        //     name: 'maxslides',
        //     alias: 's',
        //     type: integer,
        //     typeLabel: '[italic]{max_slide_count}',
        //     description: "This will cause a slide show to automaticly end after the count is reached."
    }
];

function getArgs() {
    function isValidParmeter(unknownType) {
        return (unknownType.valid) || (isUndefined(unknownType.valid));
    }

    try {
        const argumentValues = commandLineArgs(options);
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

function buildUsageInfo() {
    const sections = [
        {
            header: 'battledeck - the fun and easy way to do improvational presentations',
            content: 'Hosts images in a directory as a random presentation.'
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
                'battledeck --help',
                'battledeck -?'
            ]
        },
        {
            header: 'Options',
            optionList: options
        },
        {
            content: 'Project home: [underline]{https://github.com/JKerney-HunterIndustries/battledeck}'
        }
    ];

    return getUsage(sections);
}

// console.log(JSON.stringify(getArgs(), null, 4));
// console.log(buildUsageInfo());

module.exports = {
    getArgs: getArgs,
    buildUsageInfo: buildUsageInfo
};