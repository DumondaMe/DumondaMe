'use strict';

let userInfo = require('./../../userInfo');

let checkIsContactUser = function (contact, user) {
    return (contact && user) && (contact.userId !== user.userId);
};

let addProfileUrl = function (element, pinwallElement, pinwallPropertyName = 'contact') {
    if (pinwallElement.hasOwnProperty(pinwallPropertyName) && checkIsContactUser(pinwallElement[pinwallPropertyName], pinwallElement.user)) {
        element.name = pinwallElement[pinwallPropertyName].name;
        element.forename = pinwallElement[pinwallPropertyName].forename;
        element.userId = pinwallElement[pinwallPropertyName].userId;
        if (pinwallElement.hasOwnProperty('privacy')) {
            element.profileUrl = userInfo.getImageForPreview(
                {
                    userId: pinwallElement[pinwallPropertyName].userId,
                    profileVisible: pinwallElement.privacy.profile,
                    imageVisible: pinwallElement.privacy.image
                }, 'thumbnail.jpg');
        } else {
            element.profileUrl = userInfo.getImageForPreview(
                {
                    userId: pinwallElement[pinwallPropertyName].userId,
                    profileVisible: pinwallElement.privacyNoContact.profile,
                    imageVisible: pinwallElement.privacyNoContact.image
                }, 'thumbnail.jpg');
        }
    } else {
        element.name = pinwallElement.user.name;
        element.forename = pinwallElement.user.forename;
        element.userId = pinwallElement.user.userId;
        element.profileUrl = userInfo.getImageForPreview({
            userId: pinwallElement.user.userId, profileVisible: true, imageVisible: true
        }, 'thumbnail.jpg');
    }
};


module.exports = {
    addProfileUrl: addProfileUrl
};
