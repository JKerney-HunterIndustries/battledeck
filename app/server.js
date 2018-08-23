'use strict';

function server(
    commandLineArgumentValidator,
    fs,
    http,
    imageTools,
    logger,
    opn,
    path,
    processControl,
    stringProcessor,
    router,
    url
) {
    return function () {
        const port = 8713; // BTLE (BATTLE!!!!)

        let myArgs = commandLineArgumentValidator();

        let imageDirectory = myArgs.path.value;

        let ptr = 0;
        const baseImages = fs.readdirSync(imageDirectory).filter(imageTools.isAnImagePath);
        let images = imageTools.shuffle(baseImages);

        function endProgram(response) {
            response.end('<h1>Bye!</h1><br/>' + (new Date()) + "<br /><br /><br />Only the dead have seen the end of war.<br />.... George Santayana");
            processControl.abort();
        }

        function getImage(response) {
            if (ptr >= images.length) {
                ptr = 0;
            }

            const imageData = fs.readFileSync(path.join(imageDirectory,images[ptr]));
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

        router.addStaticScript('/signet.js', '../node_modules/signet/dist/signet.js');
        router.addStaticScript('/signet.min.js', '../node_modules/signet/dist/signet.min.js');
        router.addStaticScript('/signet.min.js.map', '../node_modules/signet/dist/signet.min.js.map');
        router.addStaticScript('/index.js', '../scripts/index.js');
        router.addStaticScript('/documentHandling.js', '../scripts/documentHandling.js');
        router.addStaticScript('/moment.js', '../node_modules/moment/min/moment-with-locales.js')
        router.addStaticScript('/moment.min.js', '../node_modules/moment/min/moment-with-locales.min.js')

        router.addStaticCss('/index.css', '../index.css');

        const homepage = stringProcessor.replaceTokensInFile(path.join(__dirname, '../index.html'));
        router.addHtml('/', homepage);
        router.addHtml('/index', homepage);
        router.addHtml('/index.htm', homepage);
        router.addHtml('/index.html', homepage);

        router.setPageNotFound(handleImageAndErrorRequests);

        const battleUrl = `http://localhost:${port}`;
        http
            .createServer(function (request, response) {
                const requestUrl = url.parse(request.url, true);
                const filepath = requestUrl.pathname;

                router.serve(response, filepath);
            })
            .listen(port, function () {
                logger.log('ready to rumble!');

                opn(battleUrl);
                logger.log(battleUrl);
            });
    }
}

module.exports = server