const http = require('http');
const opn = require('opn');
const fs = require('fs');
const url = require('url')

const port = 8713; // BTLE (BATTLE!!!!)

function isAnImagePath(name) {
    const whiteExtentions = ['.jpg', 'png', 'gif'];

    return whiteExtentions.filter(ext => name.endsWith(ext)).length > 0;
}

function shuffle(itemsArray) {
    var copy = itemsArray.slice(0);
    var target = [];

    while (copy.length > 0) {
        const ptr = Math.floor(Math.random() * copy.length);
        target.push(copy[ptr]);
        copy.splice(ptr, 1);
    }

    return target;
}

var ptr = 0;
const images = shuffle(fs.readdirSync("./img").filter(isAnImagePath));
console.log(JSON.stringify(images));

function showSlideShow(response) {
    const indexPage = fs.readFileSync('./index.html');
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(indexPage, 'text');
}

function endProgram(response, process) {
    response.end();
    process.abort();
}

function getImage(response) {
    if (ptr >= images.length) {
        ptr = 0;
    }

    console.log(ptr);
    console.log(images[ptr]);
    const imageData = fs.readFileSync(`./img/${images[ptr]}`);
    ptr++;

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(imageData, 'binary');
}

function handleError(response) {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end('<h1>Not found</h1><h2>War... War never changes.</h2>');

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
            endProgram(response, process)
        }
        else if (filepath === '/shuffle') {
            //
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
