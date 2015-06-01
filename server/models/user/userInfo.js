'use strict';

var logger = requireLogger.getLogger(__filename);
var underscore = require('underscore');
var cdn = require('../util/cdn');

var getImageForPreview = function (contact, profileType) {
    if (contact.profileVisible && contact.imageVisible) {
        return cdn.getUrl('profileImage/' + contact.userId + '/' + profileType);
    }
    return cdn.getUrl('profileImage/default/' + profileType);

};

var addImage = function (contacts, imageTyp) {
    underscore.each(contacts, function (contact) {
        contact.profileUrl = getImageForPreview(contact, imageTyp);
        delete contact.profileVisible;
        delete contact.imageVisible;
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

module.exports = {
    getImageForPreview: getImageForPreview,
    addImageForPreview: addImageForPreview,
    addImageForThumbnail: addImageForThumbnail,
    addConnectionInfo: addConnectionInfo,
    addContactPreviewInfos: function (contacts) {
        addImageForPreview(contacts);
        addConnectionInfos(contacts);
    }
};
