'use strict';

const isValidInput = signet.isTypeOf('leftBoundedInt<1>');
const get = getFrom(document);

function useSlideCount() {
    return get.enableSlideCountElement().checked;
}

function validateSlideCount() {
    const slideCountElement = get.slideCountElement();
    const value = Number(slideCountElement.value.trim());
    if (isValidInput(value)) {
        slideCountElement.value = value;
    } else {
        slideCountElement.value = 20;
    }
}

function validateMinuteCount() {
    const minuteCountElement = get.minuteCountElement(document);
    const value = Number(minuteCountElement.value.trim());
    if (isValidInput(value)) {
        minuteCountElement.value = value;
    } else {
        minuteCountElement.value = 5;
    }
}

function getSlideCount() {
    validateSlideCount();
    return Number(get.slideCountElement().value);
}

function enableBy(enable, element) {
    if (enable) {
        element.enable();
    } else {
        element.disable();
    }
}

function togglePresentationLimit() {
    const slideCountElement = get.slideCountElement();
    slideCountElement.enableIf(useSlideCount());

    const limitInMinutes = get.limitInMinutesElement(document);
    const minuteCount = get.minuteCountElement(document);
    minuteCount.enableIf(limitInMinutes.checked);
}

function togglePresentationLength() {
    const enableLimit = get.enablePresentationLengthElement(document);
    const lengthConfig = get.presentationLengthElement(document);

    lengthConfig.isVisibleIf(enableLimit.isChecked());
}

function toggleAutoAdvance() {
    const showAutoAdvance = get.showAutoAdvanceElement(document);
    const autoAdvanceSettings = get.autoAdvanceSettingsElement(document);
    
    autoAdvanceSettings.isVisibleIf(showAutoAdvance.isChecked());
}

function toggleEnableAutoAdvance() {
    const autoAdvance = get.autoAdvanceElement(document);
    const timeout = get.timeoutElement(document);

    timeout.enableIf(autoAdvance.isChecked());
}

function showConfiguration() {
    var configSection = get.configSectionElement(document);
    var configLink = get.configLinkElement(document);

    configSection.toggleVisible();
    configLink.setInnerTextBy(configSection.isHidden(), 'Show Configuration', 'Hide Configuration');
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
    get.countdownElement(document).innerText = timeout;
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

function enableElement(element) {
    element.enable();
}

function hideElement(element) {
    element.hide();
}

function showElement(element) {
    element.show();
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
    const battleImageElement = get.battleImageElement(document);
    const infoBlockElement = get.infoBlockElement(document);
    const countdownElement = get.countdownElement(document);
    const hideCountdown = !get.showCountdownElement(document).checked;
    let slideCount = 1;

    infoBlockElement.center();

    function progressSlide(limitNumberOfSlides, maxSlideCount, limitPresentationTime, maxPresentationTime) {
        return function () {
            let countdown = Number(countdownElement.innerText);
            if (countdown === 1) {
                setRandomImage(battleImageElement);

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

    function setRandomImage(imageElement) {
        return imageElement.setAttribute('src', getRandomName());
    }

    function rumble() {
        const maxPresentationTime = get.minuteCountElement(document).value;
        const limitPresentationTime = get.limitInMinutesElement(document).checked;
        const maxSlideCount = getSlideCount();
        const slideProgressionTimeout = getSlideProgressionTimeout();
        const limitNumberOfSlides = useSlideCount();
        if (slideProgressionTimeout <= 1 || hideCountdown) {
            hideElement(countdownElement);
        }

        battleImageElement.show();
        hideElement(infoBlockElement);

        clearInterval(intervalId);
        setRandomImage(battleImageElement);
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