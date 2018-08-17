'use strict';

function imageTools(
    floor,
    randomizer,
    typeBuilder
) {
    function isAnImagePath(name) {
        const whiteExtentions = ['.jpg', '.png', '.gif', '.jpeg'];

        return whiteExtentions.filter(ext => name.endsWith(ext)).length > 0;
    }

    function shuffle(itemsArray) {
            let copy = itemsArray.slice(0);
            let target = [];

            while (copy.length > 0) {
                const ptr = floor(randomizer() * copy.length);
                target.push(copy[ptr]);
                copy.splice(ptr, 1);
            }

            return target;
        }

    return {
        isAnImagePath: typeBuilder.enforce(
            'name:string => boolean',
            isAnImagePath
        ),
        shuffle: typeBuilder.enforce(
            'itemsArray:array => array',
            shuffle
        )
    };
}

module.exports = imageTools;