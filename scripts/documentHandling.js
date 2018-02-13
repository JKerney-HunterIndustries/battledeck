'use strict';

function getSlideCountElement() {
    return document.getElementById('slideCount');
}

function getBattleImageElement(document) {
    return document.getElementById('battle-image');
}

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
    const timeout = 'timeout';
    const enableSlideCount = 'enableSlideCount';


    function getTimeoutElement() {
        return document.getElementById(timeout);
    }

    function getEnableSlideCountElement() {
        return document.getElementById(enableSlideCount);
    }

    return {
        timeoutElement: getTimeoutElement,
        enableSlideCountElement: getEnableSlideCountElement
    };
}