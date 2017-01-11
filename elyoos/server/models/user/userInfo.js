'use strict';

let underscore = require('underscore');
let cdn = require('../util/cdn');
let _ = require("lodash");

let getImageForPreview = function (contact, profileType) {
    if ((contact.profileVisible && contact.imageVisible) || (contact.profileVisibleNoContact && contact.imageVisibleNoContact)) {
        return cdn.getUrl('profileImage/' + contact.userId + '/' + profileType);
    }
    return cdn.getUrl('profileImage/default/' + profileType);

};

let addImage = function (contacts, imageTyp) {
    underscore.each(contacts, function (contact) {
        contact.profileUrl = getImageForPreview(contact, imageTyp);
        delete contact.profileVisible;
        delete contact.imageVisible;
        delete contact.profileVisibleNoContact;
        delete contact.imageVisibleNoContact;
    });
};

let addImageForPreview = function (contacts) {
    addImage(contacts, 'profilePreview.jpg');
};

let addImageForThumbnail = function (contacts) {
    addImage(contacts, 'thumbnail.jpg');
};

let setUserImageVisible = function (userId, contacts) {
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
    setUserImageVisible: setUserImageVisible,
    addContactPreviewInfos: function (contacts) {
        addImageForThumbnail(contacts);
    }
};
