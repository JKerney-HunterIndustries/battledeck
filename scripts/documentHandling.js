'use strict';

function getFrom(document) {

    const getElementById = signet.enforce(
        'id:string => *',
        function getElementById(id) {
            return wrap(document.getElementById(id));
        }
    );

    function isElementHidden(element) {
        return element.classList.contains('hidden');
    }

    function showElement(element) {
        element.classList.remove('hidden');
    }

    function hideElememnt(element) {
        element.classList.add('hidden')
    }

    function enableElement(element) {
        element.removeAttribute('disabled');
    }

    function disableElement(element) {
        element.setAttribute('disabled', 'disabled');
    }

    function isElementDisabled(element) {
        return element.hasAttribute('disabled');
    }

    function centerElement(element) {
        element.setAttribute('class', 'centered');
    }

    function getClasses(element) {
        return element.getAttribute('class');
    }

    function toggleHidden(element) {
        isVisibleIf(element)(isElementHidden(element));
    }

    function isVisibleIf(element) {
        return signet.enforce(
            'predicateValue:boolean => undefined',
            function (predicateValue) {
                if (predicateValue) {
                    showElement(element);
                } else {
                    hideElememnt(element);
                }
            }
        );
    }

    function enableIf(element) {
        return signet.enforce(
            'enable:boolean => undefined',
            function (enable) {
                if (enable) {
                    enableElement(element);
                } else {
                    disableElement(element);
                }
            }
        );
    }

    function isChecked(element) {
        return element.checked;
    }

    function setInnerTextBy(element) {
        return signet.enforce(
            'chooseFirst:boolean, trueText:string, falseText:string => undefined',
            function a(chooseFirst, trueText, falseText) {
                let text = chooseFirst ? trueText : falseText;
                element.innerText = text;
            }
        );
    }

    function setAttribute(element) {
        return signet.enforce(
            'name:string, value:string => undefined',
            function a(name, value) {
                element.setAttribute(name, value);
            }
        );
    }

    function wrap(element) {
        return {
            hide: () => hideElememnt(element),
            show: () => showElement(element),
            toggleVisible: () => toggleHidden(element),
            isHidden: () => isElementHidden(element),
            enable: () => enableElement(element),
            disable: () => disableElement(element),
            isDisabled: () => isElementDisabled(element),
            center: () => centerElement(element),
            getClasses: () => getClasses(element),
            isChecked: () => isChecked(element),
            setInnerTextBy: setInnerTextBy(element),
            setAttribute: setAttribute(element),
            isVisibleIf: isVisibleIf(element),
            enableIf: enableIf(element),

            get element() {
                return element;
            },
            get innerText() {
                return element.innerText;
            },
            set innerText(value) {
                element.innerText = value;
            },
            get value() {
                return element.value;
            },
            set value(v) {
                element.value = v;
            },
            get checked() {
                return element.checked;
            },
            set checked(value) {
                element.checked = value;
            }
        }
    }

    return {
        autoAdvanceElement: () => getElementById('autoAdvance'),
        autoAdvanceSettingsElement: () => getElementById('autoAdvanceSettings'),
        battleImageElement: () => getElementById('battle-image'),
        configLinkElement: () => getElementById('configLink'),
        configSectionElement: () => getElementById('configSection'),
        countdownElement: () => getElementById('countdown'),
        enablePresentationLengthElement: () => getElementById('enablePresentationLength'),
        enableSlideCountElement: () => getElementById('enableSlideCount'),
        infoBlockElement: () => getElementById('infoBlock'),
        limitInMinutesElement: () => getElementById('limitInMitutes'),
        minuteCountElement: () => getElementById('minuteCount'),
        presentationLengthElement: () => getElementById('presentationLength'),
        showCountdownElement: () => getElementById('showCountdown'),
        slideCountElement: () => getElementById('slideCount'),
        showAutoAdvanceElement: () => getElementById('showAutoAdvance'),
        timeoutElement: () => getElementById('timeout')
    };
}