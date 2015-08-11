'use strict';

var pinwallElements,
    numberOfRows = 1;

var resetPinwallElements = function () {
    pinwallElements = [[], [], []];
};

var nextColumnIndex = function (heightColumns) {
    var index = 0, smallest = Number.MAX_VALUE;
    angular.forEach(heightColumns, function (heightColumn, key) {
        if (heightColumn < smallest) {
            smallest = heightColumn;
            index = key;
        }
    });
    return index;
};

var addPinwallElementsToColumns = function (pinwall, log) {
    var heightColumns = [], i, index;

    for (i = 0; i < numberOfRows; i++) {
        heightColumns.push(0);
    }

    angular.forEach(pinwall, function (pinwallElement) {
        if (pinwallElement.type === 'NewMessages' || pinwallElement.type === 'Contacting') {
            pinwallElements[numberOfRows - 1].unshift(pinwallElement);
            heightColumns[numberOfRows - 1] += pinwallElement.pinwallHeight;
        } else {
            index = nextColumnIndex(heightColumns);
            if (pinwallElement.hasOwnProperty('pinwallHeight')) {
                heightColumns[index] += pinwallElement.pinwallHeight;
            } else {
                log.warn("Element has no pinwall height");
            }
            pinwallElements[index].push(pinwallElement);
        }
    });
};

module.exports = ['HomePinwallElements', '$log',
    function (HomePinwallElements, $log) {


        var updatePinwall = function () {
            resetPinwallElements();
            addPinwallElementsToColumns(HomePinwallElements.getPinwall(), $log);
            return {
                pinwallElements: pinwallElements,
                userInfo: HomePinwallElements.getUserInfo()
            };
        };

        resetPinwallElements();

        this.setNumberOfRows = function (newNumber) {
            numberOfRows = newNumber;
        };

        this.updatePinwall = updatePinwall;

        this.elementRemoved = function (element) {
            function removeElement(container, elementToRemove) {
                var indexToRemove = null;
                angular.forEach(container, function (containerElement, key) {
                    if (angular.equals(containerElement, elementToRemove)) {
                        indexToRemove = key;
                    }
                });
                if (indexToRemove !== null) {
                    container.splice(indexToRemove, 1);
                }
            }

            removeElement(HomePinwallElements.getPinwall(), element);
            removeElement(pinwallElements[0], element);
            removeElement(pinwallElements[1], element);
            removeElement(pinwallElements[2], element);
        };

        this.blogAdded = function (blog) {
            HomePinwallElements.addBlog(blog);
            updatePinwall();
        };

        this.messageChanged = function (newMessages) {
            HomePinwallElements.messageChanged(newMessages);
            updatePinwall();
        };
    }];
