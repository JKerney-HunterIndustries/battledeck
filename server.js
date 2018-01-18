'use strict';

const http = require('http');
const opn = require('opn');
const fs = require('fs');
const url = require('url')

const port = 8713; // BTLE (BATTLE!!!!)
const args = process.argv.slice(2, 3);

let imageDirectory = args.length > 0 ? args[0] : './';
imageDirectory = imageDirectory.endsWith('/') ? imageDirectory : imageDirectory + "/";

function isAnImagePath(name) {
    const whiteExtentions = ['.jpg', 'png', 'gif'];

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
console.log(JSON.stringify(images));

function showSlideShow(response) {
    const indexPage = fs.readFileSync(__dirname + '/index.html');
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(indexPage, 'text');
}

function endProgram(response) {
    response.end("<h1>Bye!</h1><br/>" + (new Date()));
    process.abort();
}

function getImage(response) {
    if (ptr >= images.length) {
        ptr = 0;
    }

    console.log(ptr);
    console.log(images[ptr]);
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

http
    .createServer(function (request, response) {
        const requestUrl = url.parse(request.url, true);
        const filepath = requestUrl.pathname;
        console.log(filepath);

        if (filepath === '/') {
            showSlideShow(response)
        }
        else if (filepath === '/end') {
            endProgram(response);
        }
        else if (filepath === '/shuffle') {
            shuffleImages(response);
        }
        else if (isAnImagePath(filepath)) {
            getImage(response)
        }
        else {
            handleError(response)
        }
    })
    .listen(port, function () {
        console.log("ready to rumble!");
        opn(`http://localhost:${port}`);
    });
