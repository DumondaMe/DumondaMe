'use strict';

var pinwall,
    messages,
    contacting,
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
    if (newPinwall.hasOwnProperty('messages')) {
        messages = {messages: newPinwall.messages, type: 'NewMessages'};
    }
};

var setContacting = function (newPinwall) {
    if (newPinwall.hasOwnProperty('contacting') && newPinwall.contacting.hasOwnProperty('users')) {
        if (newPinwall.contacting.users.length > 0) {
            contacting = {contacting: newPinwall.contacting.users, numberOfContacting: newPinwall.contacting.numberOfContacting, type: 'Contacting'};
        }
    }
};

var setUserInfo = function (newPinwall) {
    if (newPinwall && newPinwall.hasOwnProperty('user') && newPinwall.user.hasOwnProperty('privacyTypes')) {
        userInfo = newPinwall.user;
    }
};

module.exports = [
    function () {

        var reset = function () {
            pinwall = [];
            messages = {};
            contacting = {};
            userInfo = null;
        };
        reset();
        this.reset = reset;

        this.getPinwall = function () {
            return pinwall;
        };

        this.getMessages = function () {
            return messages;
        };

        this.getContacting = function () {
          return contacting;
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

            setContacting(newPinwall);
            setNewMessages(newPinwall);
            setUserInfo(newPinwall);

            return tempPinwall;
        };

        this.messageChanged = function (newMessages) {
            messages = {messages: newMessages, type: 'NewMessages'};
        };
    }];
