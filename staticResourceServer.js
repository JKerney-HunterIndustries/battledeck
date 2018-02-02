const fs = require('fs');
const signet = require('./signetBuilder');


function asContentType(path, type) {
    return {
        path: path,
        type: type,
    }
}

function asScript(path) {
    return asContentType(path, 'text/plain');
}

function asHtml(path) {
    return asContentType(path, 'text/html');
}

function asCss(path) {
    return asContentType(path, 'text/css');
}

const files = {};

files['/signet.js'] = asScript('/node_modules/signet/dist/signet.js');
files['/signet.min.js'] = asScript('/node_modules/signet/dist/signet.min.js');
files['/signet.min.js.map'] = asScript('/node_modules/signet/dist/signet.min.js.map');
files['/index.js'] = asScript('/scripts/index.js');

files['/index.css'] = asCss('/index.css');

files['/'] = asHtml('/index.html');
files['/index'] = asHtml('/index.html');
files['/index.htm'] = asHtml('/index.html');
files['/index.html'] = asHtml('/index.html');

const fileKeys = Object.keys(files);

fileKeys.forEach(key => {
    let path = __dirname + files[key].path;

    files[key].path = path;
});

function fileIsServed(filename) {
    return fileKeys.includes(filename);
}


function hostFile(response, filename) {
    const fileInfo = files[filename];

    const file = fs.readFileSync(fileInfo.path);

    response.writeHead(200, { 'Content-Type': fileInfo.type });
    response.end(file, 'text');
}

const tryToHostFile = signet.enforce(
    'onNoSuchFile => tryToHostFile',
    function (onNoSuchFile) {
        return function (response, filename) {
            if (fileIsServed(filename)) {
                hostFile(response, filename);
            } else {
                onNoSuchFile(response, filename);
            }
        }
    }
);

module.exports = tryToHostFile;