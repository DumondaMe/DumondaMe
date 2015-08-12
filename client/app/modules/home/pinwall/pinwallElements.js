'use strict';

var pinwall,
    userInfo;

var setPinwallType = function (pinwallElements, type) {
    angular.forEach(pinwallElements, function (pinwallElement) {
        pinwallElement.type = type;
    });
};

var setRecommendation = function (newPinwall) {
    var tempPinwall = [];
    if (newPinwall && newPinwall.hasOwnProperty('pinwall')) {
        if (newPinwall.pinwall.length > 0) {
            setPinwallType(newPinwall.pinwall, 'Recommendation');
            tempPinwall = tempPinwall.concat(newPinwall.pinwall);
        }
    }
    return tempPinwall;
};

var setBlog = function (newPinwall, tempPinwall) {
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

var setNewMessages = function (newPinwall) {
    if (newPinwall.hasOwnProperty('messages') && newPinwall.messages.length > 0) {
        pinwall.unshift({messages: newPinwall.messages, type: 'NewMessages'});
    }
};

var setContacting = function (newPinwall) {
    if (newPinwall.hasOwnProperty('contacting') && newPinwall.contacting.hasOwnProperty('users')) {
        if (newPinwall.contacting.users.length > 0) {
            pinwall.unshift({
                contacting: newPinwall.contacting.users,
                numberOfContacting: newPinwall.contacting.numberOfContacting,
                type: 'Contacting'
            });
        }
    }
};

var setUserInfo = function (newPinwall) {
    if (newPinwall && newPinwall.hasOwnProperty('user') && newPinwall.user.hasOwnProperty('privacyTypes')) {
        userInfo = newPinwall.user;
    }
};

module.exports = ['HomePinwallHeightCalculator',
    function (HomePinwallHeightCalculator) {

        var reset = function () {
            pinwall = [];
            userInfo = null;
        };
        reset();
        this.reset = reset;

        this.getPinwall = function () {
            return pinwall;
        };

        this.getUserInfo = function () {
            return userInfo;
        };

        this.setPinwallElements = function (newPinwall) {
            var tempPinwall = setRecommendation(newPinwall);
            tempPinwall = setBlog(newPinwall, tempPinwall);
            sortPinwall(tempPinwall);
            pinwall = pinwall.concat(tempPinwall);

            if (pinwall.length === 0) {
                pinwall.unshift({type: 'NoRecommendations'});
            }

            setNewMessages(newPinwall);
            setContacting(newPinwall);
            setUserInfo(newPinwall);

            HomePinwallHeightCalculator.setHeightPinwallElements(pinwall);

            return tempPinwall;
        };

        this.addBlog = function (blog) {
            blog.type = 'Blog';
            HomePinwallHeightCalculator.calculator.Blog(blog);
            pinwall.unshift(blog);
        };

        this.messageChanged = function (newMessages) {
            var exist = false;
            angular.forEach(pinwall, function (element) {
                if (element.type === 'NewMessages') {
                    element.messages = newMessages;
                    exist = true;
                }
            });
            if (!exist) {
                pinwall.unshift({messages: newMessages, type: 'NewMessages'});
            }
        };
    }];
