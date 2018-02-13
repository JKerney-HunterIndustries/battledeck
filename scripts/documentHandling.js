'use strict';

function getInfoBlockElement(document) {
    return document.getElementById('infoBlock');
}

function getCountdownElement(document) {
    return document.getElementById('countdown');
}

function getShowCountdownElement(document) {
    return document.getElementById('showCountdown');
}

function enableElement(element) {
    element.removeAttribute('disabled');
}

function getLimitInMinutesElement(document) {
    return document.getElementById('limitInMitutes');
}

function doc(document) {

    function getElementById(id) {
        return document.getElementById(id);
    }

    return {
        timeoutElement: () => getElementById('timeout'),
        enableSlideCountElement: () => getElementById('enableSlideCount'),
        slideCountElement: () => getElementById('slideCount'),
        battleImageElement: () => getElementById('battle-image')
    };
}