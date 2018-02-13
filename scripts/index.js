'use strict';

const isValidInput = signet.isTypeOf('leftBoundedInt<1>');
const get = doc(document);

function useSlideCount() {
    return get.enableSlideCountElement().checked;
}

function validateSlideCount() {
    const slideCountElement = getSlideCountElement();
    const value = Number(slideCountElement.value.trim());
    if (isValidInput(value)) {
        slideCountElement.value = value;
    } else {
        slideCountElement.value = 20;
    }
}

function getMinuteCountElement(document) {
    return document.getElementById('minuteCount');
}

function validateMinuteCount() {
    const minuteCountElement = getMinuteCountElement(document);
    const value = Number(minuteCountElement.value.trim());
    if (isValidInput(value)) {
        minuteCountElement.value = value;
    } else {
        minuteCountElement.value = 5;
    }
}

function getSlideCount() {
    validateSlideCount();
    return Number(getSlideCountElement().value);
}

function disableElement(element) {
    element.setAttribute('disabled', 'disabled');
}

function enableBy(enable, element) {
    if (enable) {
        enableElement(element);
    } else {
        disableElement(element);
    }
}

function togglePresentationLimit() {
    const slideCountElement = getSlideCountElement();
    enableBy(useSlideCount(), slideCountElement);

    const limitInMinutes = getLimitInMinutesElement(document);
    const minuteCount = getMinuteCountElement(document);
    enableBy(limitInMinutes.checked, minuteCount);
}

function getEnablePresentationLengthElement(document) {
    return document.getElementById('enablePresentationLength');
}

function getPresentationLengthElement(document) {
    return document.getElementById('presentationLength');
}

function togglePresentationLength() {
    const enableLimit = getEnablePresentationLengthElement(document);
    const lengthConfig = getPresentationLengthElement(document);
    if (enableLimit.checked) {
        showElement(lengthConfig);
    } else {
        hideElement(lengthConfig);
    }
}

function getConfigSectionElement(document) {
    return document.getElementById('configSection');
}

function getConfigLinkElement(document) {
    return document.getElementById('configLink');
}

function showConfiguration() {
    var configSection = getConfigSectionElement(document);
    var configLink = getConfigLinkElement(document);
    var classes = configSection.getAttribute('class');

    if (classes.includes('hidden')) {
        showElement(configSection);
        configLink.innerText = 'Hide Configuration';
    } else {
        hideElement(configSection);
        configLink.innerText = 'Show Configuration';
    }
}

function getNewXhr() {
    return new XMLHttpRequest();
}

function isSuccess(status) {
    return 199 < status && status < 300;
}

function isDone(readyState) {
    return readyState === XMLHttpRequest.DONE;
}

function noop() { }

function readyStateHandler(xhr, callback) {
    return function () {
        var next = isDone(xhr.readyState) ? callback : noop;
        var error = isSuccess(xhr.status) ? null : new Error(`Explodee! ${xhr.status}`);

        next(error);
    };
}

function shuffle(callback) {
    const xhr = getNewXhr();
    xhr.open('get', '/shuffle');
    xhr.onreadystatechange = readyStateHandler(xhr, callback);
    xhr.send();
}

function getRandomName() {
    return `${Math.floor(Math.random() * 100000)}.jpg`;
}

function isNotRunning(intervalId) {
    return (intervalId === null);
}

function getValidValue(timeoutValue) {
    let value = Number(timeoutValue);
    if (isValidInput(value)) {
        return value;
    }
    else {
        return 20;
    }
}

function setSlideTimeOut(timeoutValue) {
    let timeout = getValidValue(timeoutValue);
    let element = get.timeoutElement();
    getCountdownElement(document).innerText = timeout;
    element.value = timeout;
}

function validateTimeout() {
    let timeout = getSlideProgressionTimeout();
    setSlideTimeOut(timeout);
}

function getSlideProgressionTimeout() {
    let timeout = getValidValue(get.timeoutElement().value.trim());
    return timeout;
}

function hideElement(element) {
    element.classList.add('hidden');
}

function showElement(element) {
    element.classList.remove('hidden');
}

function endCurrentPresentation(h1, battleImage, countdownElement) {
    clearInterval(intervalId);
    intervalId = null;
    hideElement(battleImage);
    hideElement(countdownElement);
    showElement(h1);
}

let intervalId = null;
document.addEventListener('keyup', function (event) {
    const battleImageElement = getBattleImageElement(document);
    const infoBlockElement = getInfoBlockElement(document);
    const countdownElement = getCountdownElement(document);
    const hideCountdown = !getShowCountdownElement(document).checked;
    let slideCount = 1;

    infoBlockElement.setAttribute('class', 'centered');

    function progressSlide(limitNumberOfSlides, maxSlideCount, limitPresentationTime, maxPresentationTime) {
        return function () {
            let countdown = Number(countdownElement.innerText);
            if (countdown === 1) {
                battleImageElement.setAttribute('src', getRandomName());

                if (limitNumberOfSlides) {
                    if (slideCount >= maxSlideCount) {
                        endCurrentPresentation(infoBlockElement, battleImageElement, countdownElement);
                        slideCount = 1;
                        return;
                    }
                    slideCount += 1;
                }

                if (limitPresentationTime) {
                    let now = moment();
                    let dateEnd = moment(startTime).add(maxPresentationTime, "minutes");
                    if (dateEnd <= now) {
                        endCurrentPresentation(infoBlockElement, battleImageElement, countdownElement);
                        slideCount = 1;
                        return;
                    }
                }
            }

            countdownElement.innerText = (countdown <= 1 ? getSlideProgressionTimeout() : countdown - 1);
        };
    }

    function rumble() {
        const maxPresentationTime = getMinuteCountElement(document).value;
        const limitPresentationTime = getLimitInMinutesElement(document).checked;
        const maxSlideCount = getSlideCount();
        const slideProgressionTimeout = getSlideProgressionTimeout();
        const limitNumberOfSlides = useSlideCount();
        if (slideProgressionTimeout <= 1 || hideCountdown) {
            hideElement(countdownElement);
        }

        showElement(battleImageElement);
        hideElement(infoBlockElement);

        clearInterval(intervalId);
        battleImageElement.setAttribute('src', getRandomName());
        intervalId = setInterval(progressSlide(limitNumberOfSlides, maxSlideCount, limitPresentationTime, maxPresentationTime), 1000);
    }

    var startTime = moment();
    function nextSlide() {
        countdownElement.innerText = getSlideProgressionTimeout();
        if (isNotRunning(intervalId)) {
            shuffle(function () {
                startTime = moment();
                showElement(countdownElement);
                rumble();
            });
        } else {
            rumble();
        }
    }

    const spaceBar = 32;
    const escapeKey = 27;

    if (event.keyCode === spaceBar) {
        nextSlide()
    }
    else if (event.keyCode === escapeKey) {
        endCurrentPresentation(infoBlockElement, battleImageElement, countdownElement);
    }
});