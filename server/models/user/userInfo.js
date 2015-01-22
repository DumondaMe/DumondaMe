'use strict';

var logger = requireLogger.getLogger(__filename);
var underscore = require('underscore');

var addImageForContactPreview = function (contacts) {
    underscore.each(contacts, function (contact) {
        if (contact.profileVisible === true && contact.imageVisible === true) {
            contact.profileUrl = 'cms/' + contact.id + '/profile/thumbnail.jpg';
        } else {
            contact.profileUrl = 'cms/default/profile/thumbnail.jpg';
        }
        delete contact.profileVisible;
        delete contact.imageVisible;
    });
};

var addConnectionInfo = function (contacts) {
    underscore.each(contacts, function (contact) {
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
    });
};

module.exports = {
    addContactPreviewInfos: function (contacts) {
        addImageForContactPreview(contacts);
        addConnectionInfo(contacts);
    }
};