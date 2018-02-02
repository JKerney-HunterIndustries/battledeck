function build() {
    const state = {};
    const routes = [];
    var pageNotFound = () => { };

    function add(route, callback) {
        state[route] = callback;
        routes.push(route);
    }

    function setPageNotFound(callback) {
        pageNotFound = callback;
    }

    function serve(response, route) {
        if (routes.includes(route)) {
            state[route](response);
        } else {
            pageNotFound(response, route);
        }
    }

    return {
        add: add,
        setPageNotFound: setPageNotFound,
        serve: serve
    }
}


module.exports = build;