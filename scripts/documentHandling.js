'use strict';

function getFrom(document) {

    function getElementById(id) {
        return document.getElementById(id);
    }

    const getConfigSectionElement = () => getElementById('configSection');
    const getConfigLinkElement = () => getElementById('configLink');

    return {
        timeoutElement: () => getElementById('timeout'),
        enableSlideCountElement: () => getElementById('enableSlideCount'),
        slideCountElement: () => getElementById('slideCount'),
        battleImageElement: () => getElementById('battle-image'),
        infoBlockElement: () => getElementById('infoBlock'),
        countdownElement: () => getElementById('countdown'),
        showCountdownElement: () => getElementById('showCountdown'),
        limitInMinutesElement: () => getElementById('limitInMitutes'),
        minuteCountElement: () => getElementById('minuteCount'),
        enablePresentationLengthElement: () => getElementById('enablePresentationLength'),
        presentationLengthElement: () => getElementById('presentationLength'),
        configSectionElement: () => getConfigSectionElement,
        configLinkElement: getConfigLinkElement
    };
}

function doc(document) {

}