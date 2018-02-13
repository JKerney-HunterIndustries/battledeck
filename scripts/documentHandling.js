'use strict';

function doc(document) {

    function getElementById(id) {
        return document.getElementById(id);
    }

    const getLimitInMinutesElement = () => getElementById('limitInMitutes');

    return {
        timeoutElement: () => getElementById('timeout'),
        enableSlideCountElement: () => getElementById('enableSlideCount'),
        slideCountElement: () => getElementById('slideCount'),
        battleImageElement: () => getElementById('battle-image'),
        infoBlockElement: () => getElementById('infoBlock'),
        countdownElement: () => getElementById('countdown'),
        showCountdownElement: () => getElementById('showCountdown'),
        limitInMinutesElement: getLimitInMinutesElement
    };
}