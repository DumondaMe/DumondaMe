'use strict';

var pinwall;
var messages;
var contacting;
var skip;
var itemsPerPage;
var timestamp;
var requestPinwallElements;
var requestPinwallElementsRunning;

var resetPinwallElements = function ($scope) {
    $scope.pinwall1Elements = [];
    $scope.pinwall2Elements = [];
    $scope.pinwall3Elements = [];
};

var addPinwallElementsToColumns = function ($scope, pinwall) {
    var i;
    if ($scope.numberOfRows === 1) {
        $scope.pinwall1Elements = $scope.pinwall1Elements.concat(pinwall);
    } else if ($scope.numberOfRows === 2) {
        for (i = 0; i < pinwall.length; i++) {
            if (i % 2 === 0) {
                $scope.pinwall1Elements.push(pinwall[i]);
            } else {
                $scope.pinwall2Elements.push(pinwall[i]);
            }
        }
    } else if ($scope.numberOfRows === 3) {
        for (i = 0; i < pinwall.length; i++) {
            if (i % 3 === 0) {
                $scope.pinwall1Elements.push(pinwall[i]);
            } else if (i % 3 === 1) {
                $scope.pinwall2Elements.push(pinwall[i]);
            } else {
                $scope.pinwall3Elements.push(pinwall[i]);
            }
        }
    }
};

var removeMessageElement = function (column, type) {
    if (column.length > 0 && column[0].type === type) {
        column.splice(0, 1);
    }
};

var addNewElementToColumns = function ($scope, messagesToColumn, arrayToCheck) {

    removeMessageElement($scope.pinwall1Elements, messagesToColumn.type);
    removeMessageElement($scope.pinwall2Elements, messagesToColumn.type);
    removeMessageElement($scope.pinwall3Elements, messagesToColumn.type);

    if (arrayToCheck && arrayToCheck.length > 0) {
        if ($scope.numberOfRows === 1) {
            $scope.pinwall1Elements.unshift(messagesToColumn);
        } else if ($scope.numberOfRows === 2) {
            $scope.pinwall2Elements.unshift(messagesToColumn);
        } else if ($scope.numberOfRows === 3) {
            $scope.pinwall3Elements.unshift(messagesToColumn);
        }
    }
};

var setPinwallType = function (pinwallElements, type) {
    angular.forEach(pinwallElements, function (pinwallElement) {
        pinwallElement.type = type;
    });
};

var setRecommendation = function ($scope, newPinwall) {
    if (newPinwall && newPinwall.hasOwnProperty('pinwall')) {
        if (newPinwall.pinwall.length > 0) {
            setPinwallType(newPinwall.pinwall, 'Recommendation');
            pinwall = pinwall.concat(newPinwall.pinwall);
            if (pinwall.length < skip - 1) {
                requestPinwallElements = false;
            }
            resetPinwallElements($scope);
            addPinwallElementsToColumns($scope, pinwall);
        } else {
            requestPinwallElements = false;
            if (pinwall.length === 0) {
                $scope.pinwall1Elements.unshift({type: 'NoRecommendations'});
            }
        }
        requestPinwallElementsRunning = false;
    }
};

var setNewMessages = function ($scope, newPinwall) {
    if (newPinwall && newPinwall.hasOwnProperty('messages')) {
        messages = {messages: newPinwall.messages, type: 'NewMessages'};
        addNewElementToColumns($scope, messages, messages.messages);
    }
};

var setContacting = function ($scope, newPinwall) {
    if (newPinwall && newPinwall.hasOwnProperty('contacting') && newPinwall.contacting.hasOwnProperty('users')) {
        if (newPinwall.contacting.users.length > 0) {
            contacting = {contacting: newPinwall.contacting.users, numberOfContacting: newPinwall.contacting.numberOfContacting, type: 'Contacting'};
            addNewElementToColumns($scope, contacting, contacting.contacting);
        }
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'Home', 'moment', function ($scope, Home, moment) {

            skip = 0;
            itemsPerPage = 30;
            timestamp = Math.floor(moment.utc().valueOf() / 1000);
            pinwall = [];
            messages = {};
            contacting = {};
            requestPinwallElements = true;
            requestPinwallElementsRunning = false;

            $scope.isExpanded = false;

            $scope.$watchCollection('pinwall', function (newPinwall) {
                setRecommendation($scope, newPinwall);
                setContacting($scope, newPinwall);
                setNewMessages($scope, newPinwall);
            });

            $scope.$watch('numberOfRows', function (newNumberOfRows) {
                if (newNumberOfRows && pinwall) {
                    resetPinwallElements($scope);
                    addPinwallElementsToColumns($scope, pinwall);
                    addNewElementToColumns($scope, contacting, contacting.contacting);
                    addNewElementToColumns($scope, messages, messages.messages);
                }
            });

            $scope.nextPinwallInfo = function () {
                if (requestPinwallElements && !requestPinwallElementsRunning) {
                    requestPinwallElementsRunning = true;
                    $scope.pinwall = Home.get({maxItems: itemsPerPage, skip: skip, timestamp: timestamp});
                    skip += itemsPerPage;
                }
            };

            $scope.$on('message.changed', function (event, newMessages) {
                messages = {messages: newMessages, type: 'NewMessages'};
                addNewElementToColumns($scope, messages, messages.messages);
            });
        }];
    }
};
