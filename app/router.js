'use strict';

function router(
    fs,
    path,
    typeBuilder
) {
    function build() {
        const state = {};
        const routes = [];
        var pageNotFound = () => { };

        const add = typeBuilder.enforce(
            'route, routerCallback => undefined',
            function add(route, routerCallback) {
                state[route] = routerCallback;
                routes.push(route);
            }
        );

        function hostFile(resoursePath, contentType) {
            return function (response) {
                const file = fs.readFileSync(resoursePath);

                response.writeHead(200, { 'Content-Type': contentType });
                response.end(file, 'text');
            }
        }

        function hostHtmlString(html) {
            return function (response) {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(html, 'text');
            }
        }

        const addStatic = typeBuilder.enforce(
            'route, path, contentType => undefined',
            function addStatic(route, resoursePath, contentType) {
                add(route, hostFile(path.join(__dirname, resoursePath), contentType));
            }
        );

        const addHtml = typeBuilder.enforce(
            'route, html => undefined',
            function addHtml(route, html) {
                add(route, hostHtmlString(html));
            }
        );

        const addStaticHtml = typeBuilder.enforce(
            'route, path => undefined',
            function addStaticHtml(route, resoursePath) {
                addStatic(route, resoursePath, 'text/html');
            }
        );

        const addStaticCss = typeBuilder.enforce(
            'route, path => undefined',
            function addStaticCss(route, resoursePath) {
                addStatic(route, resoursePath, 'text/css');
            }
        );

        const addStaticScript = typeBuilder.enforce(
            'route, path => undefined',
            function addStaticScript(route, resoursePath) {
                addStatic(route, resoursePath, 'text/plain');
            }
        );

        const setPageNotFound = typeBuilder.enforce(
            'routeNotFoundCallback => undefined',
            function setPageNotFound(routeNotFoundCallback) {
                pageNotFound = routeNotFoundCallback;
            }
        );

        const serve = typeBuilder.enforce(
            'response, route => undefined',
            function serve(response, route) {
                if (routes.includes(route)) {
                    state[route](response);
                } else {
                    pageNotFound(response, route);
                }
            }
        );

        return {
            add: add,
            addStatic: addStatic,
            addStaticHtml: addStaticHtml,
            addStaticCss: addStaticCss,
            addStaticScript: addStaticScript,
            addHtml: addHtml,

            setPageNotFound: setPageNotFound,

            serve: serve
        }
    }


    return build();
}

module.exports = router;