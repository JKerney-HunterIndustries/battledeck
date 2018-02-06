const isValidInput = signet.isTypeOf('leftBoundedInt<1>');

function getTimeoutElement() {
    return document.getElementById('timeout');
}

function getEnableSlideCountElement() {
    return document.getElementById('enableSlideCount');
}

function getSlideCountElement() {
    return document.getElementById('slideCount');
}

function useSlideCount() {
    return getEnableSlideCountElement().checked;
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

function getSlideCount() {
    validateSlideCount();
    return Number(getSlideCountElement().value);
}

function toggleMaxCount() {
    const slideCountElement = getSlideCountElement();
    if (useSlideCount()) {
        slideCountElement.removeAttribute('disabled');
    } else {
        slideCountElement.setAttribute('disabled', 'disabled');
    }

    const limitInMinutes = document.getElementById('limitInMitutes')
    const minuteCount = document.getElementById('minuteCount');
    if (limitInMinutes.checked) {
        minuteCount.removeAttribute('disabled');
    } else{
        minuteCount.setAttribute('disabled', 'disabled');
    }
}

function togglePresentationLength() {
    const enableLimit = document.getElementById('enablePresentationLength');
    const lengthConfig = document.getElementById('presentationLength');
    if (enableLimit.checked) {
        showElement(lengthConfig);
    } else {
        hideElement(lengthConfig);
    }
}

function showConfiguration() {
    var configSection = document.getElementById('configSection');
    var configLink = document.getElementById('configLink');
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
    let element = getTimeoutElement();
    document.getElementById('countdown').innerText = timeout;
    element.value = timeout;
}

function validateTimeout() {
    let timeout = getSlideTimeout();
    setSlideTimeOut(timeout);
}

function getSlideTimeout() {
    let timeout = getValidValue(getTimeoutElement().value.trim());
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
    const battleImage = document.getElementById('battle-image');
    const h1 = document.getElementById('infoBlock');
    const countdownElement = document.getElementById('countdown');
    const hideCountdown = !document.getElementById('showCountdown').checked;
    let slideCount = 1;

    h1.setAttribute('class', 'centered');

    function progressSlide(countSlides, maxSlideCount) {
        return function () {
            let countdown = Number(countdownElement.innerText);
            if (countdown === 1) {
                battleImage.setAttribute('src', getRandomName());

                if (countSlides) {
                    if (slideCount >= maxSlideCount) {
                        endCurrentPresentation(h1, battleImage, countdownElement);
                        slideCount = 1;
                        return;
                    }
                    slideCount += 1;
                }
            }

            countdownElement.innerText = (countdown <= 1 ? getSlideTimeout() : countdown - 1);
        };
    }

    function rumble() {
        const maxSlideCount = getSlideCount();
        const timeout = getSlideTimeout();
        const countSlides = useSlideCount();
        if (timeout <= 1 || hideCountdown) {
            hideElement(countdownElement);
        }

        showElement(battleImage);
        hideElement(h1);

        clearInterval(intervalId);
        battleImage.setAttribute('src', getRandomName());
        intervalId = setInterval(progressSlide(countSlides, maxSlideCount), 1000);
    }

    function nextSlide() {
        countdownElement.innerText = getSlideTimeout();
        if (isNotRunning(intervalId)) {
            shuffle(function () {
                showElement(countdownElement);
                rumble();
            });
        } else {
            rumble();
        }
    }

    if (event.keyCode === 32) {
        nextSlide()
    }
    else if (event.keyCode === 27) {
        endCurrentPresentation(h1, battleImage, countdownElement);
    }
});