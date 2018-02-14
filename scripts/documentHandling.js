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

    function enableIf(element) {
        return signet.enforce(
            'enable:boolean => undefined',
            function (enable) {
                if (enable) {
                    element.enable();
                } else {
                    element.disable();
                }
            }
        );
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
        if (isElementHidden(element)) {
            showElement(element);
        } else {
            hideElememnt(element);
        }
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
            hide:           () => hideElememnt(element),
            show:           () => showElement(element),
            toggleVisible:  () => toggleHidden(element),
            isHidden:       () => isElementHidden(element),
            enable:         () => enableElement(element),
            enableIf:       enableIf(element),
            disable:        () => disableElement(element),
            isDisabled:     () => isElementDisabled(element),
            center:         () => centerElement(element),
            getClasses:     () => getClasses(element),
            setInnerTextBy: setInnerTextBy(element),
            setAttribute:   setAttribute(element),
            
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
        timeoutElement:                  () => getElementById('timeout'),
        enableSlideCountElement:         () => getElementById('enableSlideCount'),
        slideCountElement:               () => getElementById('slideCount'),
        battleImageElement:              () => getElementById('battle-image'),
        infoBlockElement:                () => getElementById('infoBlock'),
        countdownElement:                () => getElementById('countdown'),
        showCountdownElement:            () => getElementById('showCountdown'),
        limitInMinutesElement:           () => getElementById('limitInMitutes'),
        minuteCountElement:              () => getElementById('minuteCount'),
        enablePresentationLengthElement: () => getElementById('enablePresentationLength'),
        presentationLengthElement:       () => getElementById('presentationLength'),
        configSectionElement:            () => getElementById('configSection'),
        configLinkElement:               () => getElementById('configLink')
    };
}