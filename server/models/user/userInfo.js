'use strict';

var underscore = require('underscore');
var cdn = require('../util/cdn');
var _ = require("lodash");

var getImageForPreview = function (contact, profileType) {
    if ((contact.profileVisible && contact.imageVisible) || (contact.profileVisibleNoContact && contact.imageVisibleNoContact)) {
        return cdn.getUrl('profileImage/' + contact.userId + '/' + profileType);
    }
    return cdn.getUrl('profileImage/default/' + profileType);

};

var addImage = function (contacts, imageTyp) {
    underscore.each(contacts, function (contact) {
        contact.profileUrl = getImageForPreview(contact, imageTyp);
        delete contact.profileVisible;
        delete contact.imageVisible;
        delete contact.profileVisibleNoContact;
        delete contact.imageVisibleNoContact;
    });
};

var addImageForPreview = function (contacts) {
    addImage(contacts, 'profilePreview.jpg');
};

var addImageForThumbnail = function (contacts) {
    addImage(contacts, 'thumbnail.jpg');
};

var addConnectionInfo = function (contact) {
    if (contact.contactType && contact.type) {
        contact.connected = 'both';
    } else if (!contact.contactType && contact.type) {
        contact.connected = 'userToContact';
    } else if (contact.contactType && !contact.type) {
        contact.connected = 'contactToUser';
    } else {
        contact.connected = 'none';
    }
    delete contact.contactType;
};

var addConnectionInfos = function (contacts) {
    underscore.each(contacts, function (contact) {
        addConnectionInfo(contact);
    });
};

var setUserImageVisible = function (userId, contacts) {
    _.each(contacts, function (contact) {
        if (contact.userId === userId) {
            contact.profileVisible = true;
            contact.imageVisible = true;
        }
    });
};

module.exports = {
    getImageForPreview: getImageForPreview,
    addImageForPreview: addImageForPreview,
    addImageForThumbnail: addImageForThumbnail,
    addConnectionInfo: addConnectionInfo,
    setUserImageVisible: setUserImageVisible,
    addContactPreviewInfos: function (contacts) {
        addImageForThumbnail(contacts);
        addConnectionInfos(contacts);
    }
};
