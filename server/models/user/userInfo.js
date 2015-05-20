'use strict';

var logger = requireLogger.getLogger(__filename);
var underscore = require('underscore');
var cdn = require('../util/cdn');

var addImageForPreview = function (contacts) {
    underscore.each(contacts, function (contact) {
        if (contact.profileVisible && contact.imageVisible) {
            contact.profileUrl = cdn.getUrl('profileImage/' + contact.userId + '/profilePreview.jpg');
        } else {
            contact.profileUrl = cdn.getUrl('profileImage/default/profilePreview.jpg');
        }
        delete contact.profileVisible;
        delete contact.imageVisible;
    });
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
    addImageForPreview: addImageForPreview,
    addConnectionInfo: addConnectionInfo,
    addContactPreviewInfos: function (contacts) {
        addImageForPreview(contacts);
        addConnectionInfos(contacts);
    }
};
