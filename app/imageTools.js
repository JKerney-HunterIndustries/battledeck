'use strict';

function imageTools(
    typeBuilder
) {
    const isAnImagePath = typeBuilder.enforce(
        'name:string => boolean',
        function isAnImagePath(name) {
            const whiteExtentions = ['.jpg', '.png', '.gif', '.jpeg'];

            return whiteExtentions.filter(ext => name.endsWith(ext)).length > 0;
        }
    );

    const shuffle = typeBuilder.enforce(
        'itemsArray:array => array',
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
    );

    return {
        isAnImagePath: isAnImagePath,
        shuffle: shuffle
    };
}

module.exports = imageTools;