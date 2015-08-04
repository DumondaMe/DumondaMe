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
    var tempPinwall = [];
    if (newPinwall && newPinwall.hasOwnProperty('pinwall')) {
        if (newPinwall.pinwall.length > 0) {
            setPinwallType(newPinwall.pinwall, 'Recommendation');
            tempPinwall = tempPinwall.concat(newPinwall.pinwall);
        }
    }
    return tempPinwall;
};

var setBlog = function ($scope, newPinwall, tempPinwall) {
    if (newPinwall && newPinwall.hasOwnProperty('blog')) {
        if (newPinwall.blog.length > 0) {
            setPinwallType(newPinwall.blog, 'Blog');
            tempPinwall = tempPinwall.concat(newPinwall.blog);
        }
    }
    return tempPinwall;
};

var sortPinwall = function (tempPinwall) {
    return tempPinwall.sort(function (a, b) {
        return b.created - a.created;
    });
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

var setUserInfo = function ($scope, newPinwall) {
    if (newPinwall && newPinwall.hasOwnProperty('user') && newPinwall.user.hasOwnProperty('privacyTypes')) {
        $scope.userInfo = newPinwall.user;
    }
};

var checkRequestPinwall = function (pinwall, reqestedNumberOfElements) {
    function countElements(pinwallElements, type) {
        var count = 0;
        angular.forEach(pinwallElements, function (pinwallElement) {
            if (pinwallElement.type === type) {
                count++;
            }
        });
        return count;
    }

    return !(countElements(pinwall, 'Blog') < reqestedNumberOfElements && countElements(pinwall, 'Recommendation') < reqestedNumberOfElements );
};

var updatePinwall = function ($scope) {
    resetPinwallElements($scope);
    sortPinwall(pinwall);
    addPinwallElementsToColumns($scope, pinwall);
    addNewElementToColumns($scope, contacting, contacting.contacting);
    addNewElementToColumns($scope, messages, messages.messages);
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
                if (newPinwall) {
                    var tempPinwall = setRecommendation($scope, newPinwall);
                    tempPinwall = setBlog($scope, newPinwall, tempPinwall);
                    sortPinwall(tempPinwall);
                    resetPinwallElements($scope);
                    pinwall = pinwall.concat(tempPinwall);
                    addPinwallElementsToColumns($scope, pinwall);
                    requestPinwallElements = checkRequestPinwall(tempPinwall, itemsPerPage);
                    requestPinwallElementsRunning = false;

                    setContacting($scope, newPinwall);
                    setNewMessages($scope, newPinwall);
                    setUserInfo($scope, newPinwall);
                }
            });

            $scope.$watch('numberOfRows', function (newNumberOfRows) {
                if (newNumberOfRows && pinwall) {
                    updatePinwall($scope);
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

            $scope.blogAdded = function (blog) {
                blog.type = 'Blog';
                pinwall.unshift(blog);
                updatePinwall($scope);
            };
        }];
    }
};
