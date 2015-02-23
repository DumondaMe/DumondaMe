'use strict';

var logger = requireLogger.getLogger(__filename);
var underscore = require('underscore');
var cdn = require('../util/cdn');
var moment = require('moment');

var addImageForPreview = function (contacts, expires) {
    underscore.each(contacts, function (contact) {
        var expiresWrapper = moment(expires).valueOf();
        if (contact.profileVisible && contact.imageVisible) {
            contact.profileUrl = cdn.getUrl(contact.id + '/profile/profilePreview.jpg', expiresWrapper);
        } else {
            contact.profileUrl = cdn.getUrl('default/profile/profilePreview.jpg', expiresWrapper);
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
    addContactPreviewInfos: function (contacts, expires) {
        addImageForPreview(contacts, expires);
        addConnectionInfo(contacts);
    }
};
