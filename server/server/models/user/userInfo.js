'use strict';

var logger = requireLogger.getLogger(__filename);
var underscore = require('underscore');
var cdn = require('../util/cdn');
var moment = require('moment');

var addImageForPreview = function (contacts) {
    underscore.each(contacts, function (contact) {
        if (contact.profileVisible && contact.imageVisible) {
            contact.profileUrl = cdn.getUrl(contact.id + '/profilePreview.jpg');
        } else {
            contact.profileUrl = cdn.getUrl('default/profilePreview.jpg');
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
    addImageForPreview: addImageForPreview,
    addContactPreviewInfos: function (contacts) {
        addImageForPreview(contacts);
        addConnectionInfo(contacts);
    }
};
