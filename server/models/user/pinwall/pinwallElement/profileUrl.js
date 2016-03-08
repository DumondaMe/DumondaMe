'use strict';

var userInfo = require('./../../userInfo');

var addProfileUrl = function (element, pinwallElement) {
    if (pinwallElement.hasOwnProperty('contact')) {
        element.name = pinwallElement.contact.name;
        element.userId = pinwallElement.contact.userId;
        if (pinwallElement.hasOwnProperty('privacy')) {
            element.profileUrl = userInfo.getImageForPreview(
                {
                    userId: pinwallElement.contact.userId,
                    profileVisible: pinwallElement.privacy.profile,
                    imageVisible: pinwallElement.privacy.image
                }, 'thumbnail.jpg');
        } else {
            element.profileUrl = userInfo.getImageForPreview(
                {
                    userId: pinwallElement.contact.userId,
                    profileVisible: pinwallElement.privacyNoContact.profile,
                    imageVisible: pinwallElement.privacyNoContact.image
                }, 'thumbnail.jpg');
        }
    } else {
        element.name = pinwallElement.user.name;
        element.userId = pinwallElement.user.userId;
        element.profileUrl = userInfo.getImageForPreview({
            userId: pinwallElement.user.userId, profileVisible: true, imageVisible: true
        }, 'thumbnail.jpg');
    }
};


module.exports = {
    addProfileUrl: addProfileUrl
};
