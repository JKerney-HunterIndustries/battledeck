'use strict';

const fs = require('fs');
const signet = require('./signetBuilder');
const paths = require('path');

function build() {
    const state = {};
    const routes = [];
    var pageNotFound = () => { };

    const add = signet.enforce(
        'route, routerCallback => undefined',
        function add(route, routerCallback) {
            state[route] = routerCallback;
            routes.push(route);
        }
    );

    function hostFile(path, contentType) {
        return function (response) {
            const file = fs.readFileSync(path);

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

    const addStatic = signet.enforce(
        'route, path, contentType => undefined',
        function addStatic(route, path, contentType) {
            add(route, hostFile(paths.join(__dirname, path), contentType));
        }
    );

    const addHtml = signet.enforce(
        'route, html => undefined',
        function addHtml(route, html) {
            add(route, hostHtmlString(html));
        }
    );

    const addStaticHtml = signet.enforce(
        'route, path => undefined',
        function addStaticHtml(route, path) {
            addStatic(route, path, 'text/html');
        }
    );

    const addStaticCss = signet.enforce(
        'route, path => undefined',
        function addStaticCss(route, path) {
            addStatic(route, path, 'text/css');
        }
    );

    const addStaticScript = signet.enforce(
        'route, path => undefined',
        function addStaticScript(route, path) {
            addStatic(route, path, 'text/plain');
        }
    );

    const setPageNotFound = signet.enforce(
        'routeNotFoundCallback => undefined',
        function setPageNotFound(routeNotFoundCallback) {
            pageNotFound = routeNotFoundCallback;
        }
    );

    const serve = signet.enforce(
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


module.exports = build;