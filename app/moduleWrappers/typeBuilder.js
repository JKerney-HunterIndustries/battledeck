'use strict';

function typeBuilder(
    signet,
    types
) {
    let typeSystem = signet();

    return types(typeSystem);
}

module.exports = typeBuilder;