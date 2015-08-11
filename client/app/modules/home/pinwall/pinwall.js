'use strict';

var pinwall1Elements,
    pinwall2Elements,
    pinwall3Elements,
    numberOfRows = 1;

var resetPinwallElements = function () {
    pinwall1Elements = [];
    pinwall2Elements = [];
    pinwall3Elements = [];
};

var removeMessageElement = function (column, type) {
    if (column.length > 0 && column[0].type === type) {
        column.splice(0, 1);
    }
};

var addNewElementToColumns = function (messagesToColumn, arrayToCheck) {

    removeMessageElement(pinwall1Elements, messagesToColumn.type);
    removeMessageElement(pinwall2Elements, messagesToColumn.type);
    removeMessageElement(pinwall3Elements, messagesToColumn.type);

    if (arrayToCheck && arrayToCheck.length > 0) {
        if (numberOfRows === 1) {
            pinwall1Elements.unshift(messagesToColumn);
        } else if (numberOfRows === 2) {
            pinwall2Elements.unshift(messagesToColumn);
        } else if (numberOfRows === 3) {
            pinwall3Elements.unshift(messagesToColumn);
        }
    }
};

var addPinwallElementsToColumns = function (pinwall, contacting, messages) {
    var i;

    addNewElementToColumns(contacting, contacting.contacting);
    addNewElementToColumns(messages, messages.messages);

    if (numberOfRows === 1) {
        pinwall1Elements = pinwall1Elements.concat(pinwall);
    } else if (numberOfRows === 2) {
        for (i = 0; i < pinwall.length; i++) {
            if (i % 2 === 0) {
                pinwall1Elements.push(pinwall[i]);
            } else {
                pinwall2Elements.push(pinwall[i]);
            }
        }
    } else if (numberOfRows === 3) {
        for (i = 0; i < pinwall.length; i++) {
            if (i % 3 === 0) {
                pinwall1Elements.push(pinwall[i]);
            } else if (i % 3 === 1) {
                pinwall2Elements.push(pinwall[i]);
            } else {
                pinwall3Elements.push(pinwall[i]);
            }
        }
    }
};

module.exports = ['HomePinwallElements',
    function (HomePinwallElements) {


        var updatePinwall = function () {
            resetPinwallElements();
            addPinwallElementsToColumns(HomePinwallElements.getPinwall(), HomePinwallElements.getContacting(), HomePinwallElements.getMessages());
            return {
                pinwall1Elements: pinwall1Elements,
                pinwall2Elements: pinwall2Elements,
                pinwall3Elements: pinwall3Elements,
                userInfo: HomePinwallElements.getUserInfo()
            };
        };

        resetPinwallElements();

        this.setNumberOfRows = function (newNumber) {
            numberOfRows = newNumber;
        };
/*
        this.getPinwallElements = function () {
            return {
                pinwall1Elements: pinwall1Elements,
                pinwall2Elements: pinwall2Elements,
                pinwall3Elements: pinwall3Elements,
                userInfo: HomePinwallElements.getUserInfo()
            };
        };*/

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

            removeElement(HomePinwallElements.pinwall, element);
            removeElement(pinwall1Elements, element);
            removeElement(pinwall2Elements, element);
            removeElement(pinwall3Elements, element);
        };

        this.blogAdded = function (blog) {
            blog.type = 'Blog';
            HomePinwallElements.pinwall.unshift(blog);
            updatePinwall();
        };

        this.messageChanged = function (newMessages) {
            HomePinwallElements.messages = {messages: newMessages, type: 'NewMessages'};
            addNewElementToColumns(HomePinwallElements.messages, HomePinwallElements.messages.messages);
        };
    }];
