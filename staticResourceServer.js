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

const files = {};

files['/signet.js'] = asScript('/node_modules/signet/dist/signet.js');
files['/signet.min.js'] = asScript('/node_modules/signet/dist/signet.min.js');
files['/signet.min.js.map'] = asScript('/node_modules/signet/dist/signet.min.js.map');
files['/'] = asHtml('/index.html');

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
    'onNoSuchFile => *',
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