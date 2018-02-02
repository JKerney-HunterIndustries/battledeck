'use strict';

const http = require('http');
const opn = require('opn');
const fs = require('fs');
const url = require('url')
const commandLineArgs = require('./commandLineAgs');
const staticServer = require('./staticResourceServer');

const port = 8713; // BTLE (BATTLE!!!!)

let myArgsState = commandLineArgs.getArgs();
let myArgs = myArgsState.value;
if ((!myArgsState.valid) || myArgsState.isError || myArgs.help) {
    console.log(commandLineArgs.buildUsageInfo());
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

if ((!myArgsState.valid) || myArgsState.isError || myArgs.help) {
    process.exit();
}

let imageDirectory = myArgs.path.value;


function isAnImagePath(name) {
    const whiteExtentions = ['.jpg', '.png', '.gif', '.jpeg'];

    return whiteExtentions.filter(ext => name.endsWith(ext)).length > 0;
}

function shuffle(itemsArray) {
    let copy = itemsArray.slice(0);
    let target = [];

    while (copy.length > 0) {
        const ptr = Math.floor(Math.random() * copy.length);
        target.push(copy[ptr]);
        copy.splice(ptr, 1);
    }

    return target;
}

let ptr = 0;
const baseImages = fs.readdirSync(imageDirectory).filter(isAnImagePath);
let images = shuffle(baseImages);

function showSlideShow(response) {
    const indexPage = fs.readFileSync(__dirname + '/index.html');
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(indexPage, 'text');
}

function endProgram(response) {
    response.end('<h1>Bye!</h1><br/>' + (new Date()));
    process.abort();
}

function getImage(response) {
    if (ptr >= images.length) {
        ptr = 0;
    }

    const imageData = fs.readFileSync(`${imageDirectory}${images[ptr]}`);
    ptr++;

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(imageData, 'binary');
}

function handleError(response) {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end('<h1>Not found</h1><h2>War... War never changes.</h2>');

}

function shuffleImages(response) {
    images = shuffle(baseImages);
    response.end();
}

const battleUrl = `http://localhost:${port}`;
function handleRequest(response, filepath) {
    if (filepath === '/end') {
        endProgram(response);
    }
    else if (filepath === '/shuffle') {
        shuffleImages(response);
    }
    else if (isAnImagePath(filepath)) {
        getImage(response)
    }
    else {
        handleError(response);
    }
}

const serveSite = staticServer(handleRequest);

http
    .createServer(function (request, response) {
        const requestUrl = url.parse(request.url, true);
        const filepath = requestUrl.pathname;

        serveSite(response, filepath);
    })
    .listen(port, function () {
        console.log('ready to rumble!');

        opn(battleUrl);
        console.log(battleUrl);
    });
