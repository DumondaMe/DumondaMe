'use strict';

var skip,
    itemsPerPage,
    timestamp,
    pinwall,
    messages,
    contacting,
    requestPinwallElements,
    requestPinwallElementsRunning,
    scopeController;

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

var getNewPinwallElements = function (newPinwallElements, compare) {
    var result = [];
    angular.forEach(newPinwallElements, function (newPinwallElement) {
        var exists = false;
        angular.forEach(pinwall, function (pinwallElement) {
            if (compare(pinwallElement, newPinwallElement)) {
                exists = true;
            }
        });
        if (!exists) {
            result.push(newPinwallElement)
        }
    });
    return result;
};

var getNewRecommendations = function ($scope, newPinwall) {

    if (newPinwall.hasOwnProperty('pinwall')) {
        if (newPinwall.pinwall.length > 0) {
            setPinwallType(newPinwall.pinwall, 'Recommendation');
            return getNewPinwallElements(newPinwall.pinwall, function (pinwallElement, newPinwallElement) {
                return (pinwallElement.type === 'Recommendation' && pinwallElement.pageId === newPinwallElement.pageId &&
                pinwallElement.rating === newPinwallElement.rating &&
                pinwallElement.numberOfRatingsByContacts === newPinwallElement.numberOfRatingsByContacts &&
                pinwallElement.description === newPinwallElement.description)
            });
        }
    }
    return [];
};

var getNewBlogs = function (newPinwall, tempPinwall) {
    if (newPinwall.hasOwnProperty('blog')) {
        if (newPinwall.blog.length > 0) {
            setPinwallType(newPinwall.blog, 'Blog');
            tempPinwall = tempPinwall.concat(getNewPinwallElements(newPinwall.blog, function (pinwallElement, newPinwallElement) {
                return (pinwallElement.type === 'Blog' && pinwallElement.blogId === newPinwallElement.blogId &&
                pinwallElement.text === newPinwallElement.text)
            }));
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
    if (newPinwall.hasOwnProperty('messages')) {
        messages = {messages: newPinwall.messages, type: 'NewMessages'};
        addNewElementToColumns($scope, messages, messages.messages);
    }
};

var setContacting = function ($scope, newPinwall) {
    if (newPinwall.hasOwnProperty('contacting') && newPinwall.contacting.hasOwnProperty('users')) {
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

module.exports = ['moment', 'Home',
    function (moment, Home) {

        var updatePinwall;
        pinwall = [];
        messages = {};
        contacting = {};

        this.resetCache = function () {
            timestamp = Math.floor(moment.utc().valueOf() / 1000);
            skip = 0;
            itemsPerPage = 5;
            requestPinwallElements = true;
            requestPinwallElementsRunning = false;
        };

        this.resetCache();

        this.setScopeController = function (scope) {
            scopeController = scope;
        };

        this.requestPinwall = function () {
            var newPinwall;
            if (requestPinwallElements && !requestPinwallElementsRunning) {
                requestPinwallElementsRunning = true;
                newPinwall = Home.get({maxItems: itemsPerPage, skip: skip, timestamp: timestamp}, function () {

                    var tempPinwall = getNewRecommendations(scopeController, newPinwall);
                    tempPinwall = getNewBlogs(newPinwall, tempPinwall);
                    resetPinwallElements(scopeController);
                    pinwall = pinwall.concat(tempPinwall);
                    sortPinwall(pinwall);
                    if (pinwall.length === 0 && newPinwall.hasOwnProperty('pinwall')) {
                        scopeController.pinwall1Elements.unshift({type: 'NoRecommendations'});
                    }
                    addPinwallElementsToColumns(scopeController, pinwall);
                    requestPinwallElements = checkRequestPinwall(tempPinwall, itemsPerPage);
                    requestPinwallElementsRunning = false;

                    setContacting(scopeController, newPinwall);
                    setNewMessages(scopeController, newPinwall);
                    setUserInfo(scopeController, newPinwall);
                }, function () {
                    requestPinwallElementsRunning = false;
                });
                skip += itemsPerPage;
            }
        };

        updatePinwall = function (scope) {
            resetPinwallElements(scope);
            sortPinwall(pinwall);
            addPinwallElementsToColumns(scope, pinwall);
            addNewElementToColumns(scope, contacting, contacting.contacting);
            addNewElementToColumns(scope, messages, messages.messages);
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

            removeElement(pinwall, element);
            removeElement(scopeController.pinwall1Elements, element);
            removeElement(scopeController.pinwall2Elements, element);
            removeElement(scopeController.pinwall3Elements, element);
        };

        this.blogAdded = function (blog) {
            blog.type = 'Blog';
            pinwall.unshift(blog);
            updatePinwall(scopeController);
        };

        this.messageChanged = function (newMessages) {
            messages = {messages: newMessages, type: 'NewMessages'};
            addNewElementToColumns(scopeController, messages, messages.messages);
        }
    }];
