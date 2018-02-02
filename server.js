'use strict';

const http = require('http');
const opn = require('opn');
const fs = require('fs');
const url = require('url')
const commandLineArgs = require('./commandLineAgs');
const signet = require('./signetBuilder');
const router = require('./router')();
const imageTools = require('./imageTools');

const port = 8713; // BTLE (BATTLE!!!!)

let myArgsState = commandLineArgs.getArgs();
let myArgs = myArgsState.value;

function validateCommandLineArguments(myArgs) {
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
}

validateCommandLineArguments(myArgs);

let imageDirectory = myArgs.path.value;

let ptr = 0;
const baseImages = fs.readdirSync(imageDirectory).filter(imageTools.isAnImagePath);
let images = imageTools.shuffle(baseImages);

function endProgram(response) {
    response.end('<h1>Bye!</h1><br/>' + (new Date()) + "<br /><br /><br />Only the dead have seen the end of war.<br />.... George Santayana");
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
    response.end('<h1>Not found</h1><h2>War... War never changes.</h2><br /><br /><a href="/">Back to battledeck!</a>');

}

function shuffleImages(response) {
    images = imageTools.shuffle(baseImages);
    response.end();
}

const battleUrl = `http://localhost:${port}`;

function handleImageAndErrorRequests(response, filepath) {
    if (imageTools.isAnImagePath(filepath)) {
        getImage(response)
    }
    else {
        handleError(response);
    }
}

router.add('/end', endProgram);
router.add('/shuffle', shuffleImages);

router.addStaticScript('/signet.js', '/node_modules/signet/dist/signet.js');
router.addStaticScript('/signet.min.js', '/node_modules/signet/dist/signet.min.js');
router.addStaticScript('/signet.min.js.map', '/node_modules/signet/dist/signet.min.js.map');
router.addStaticScript('/index.js', '/scripts/index.js');

router.addStaticCss('/index.css', '/index.css');

router.addStaticHtml('/', '/index.html');
router.addStaticHtml('/index', '/index.html');
router.addStaticHtml('/index.htm', '/index.html');
router.addStaticHtml('/index.html', '/index.html');

router.setPageNotFound(handleImageAndErrorRequests);


http
    .createServer(function (request, response) {
        const requestUrl = url.parse(request.url, true);
        const filepath = requestUrl.pathname;

        router.serve(response, filepath);
    })
    .listen(port, function () {
        console.log('ready to rumble!');

        opn(battleUrl);
        console.log(battleUrl);
    });
