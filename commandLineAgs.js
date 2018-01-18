'use strict';

const signet = require('signet')();
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const isValidPath = require('is-valid-path');
const fs = require('fs');

const typeName = 'max_slide_count';
signet.alias(typeName, 'formattedString<^[1-9]$|^([1-9][0-9]+)$>');

const verifyInteger = signet.verifyValueType(typeName);

function getErrorMessage(name, value) {
    return `${name} must be a valid path to a directory. Instead given ${value}`;
}

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
        typeLabel: '[italic]{image folder path}',
        description: "The path where images to be used as slides are contained."
    },
    {
        name: 'maxslides',
        alias: 's',
        type: integer,
        typeLabel: '[italic]{max Slide Count}',
        description: "This will cause a slide show to automaticly end after the count is reached."
    }
];

function getArgs() {
    return commandLineArgs(options);
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
                'Examples of use:\n',
                'battledeck',
                'battledeck imagepath',
                'battledeck --maxslides 20'
            ]
        }
    ];
}

console.log(JSON.stringify(getArgs()));

// module.exports = {
//     getArgs: getArgs
// };