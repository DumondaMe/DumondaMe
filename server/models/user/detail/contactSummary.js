'use strict';

var userInfo = require('../userInfo');
var _ = require('lodash');
var contact = require('./contact');
var contacting = require('./contacting');

var setUserImageVisible = function (userId, contacts) {
    _.each(contacts, function (contact) {
        if (contact.userId === userId) {
            contact.profileVisible = true;
            contact.imageVisible = true;
        }
    });
};

var getContactInfo = function (userId, userDetailId, contactsPerPage, skipContacts) {
    var commands = [];

    commands.push(contact.numberOfContacts(userDetailId).getCommand());
    commands.push(contact.numberOfSameContacts(userId, userDetailId).getCommand());
    commands.push(contact.getContacts(userId, userDetailId, contactsPerPage, skipContacts).getCommand());

    commands.push(contacting.numberOfContacting(userDetailId).getCommand());

    return contacting.getContacting(userId, userDetailId, contactsPerPage, skipContacts).send(commands)
        .then(function (resp) {
            userInfo.addImageForPreview(resp[2]);
            userInfo.addImageForPreview(resp[4]);
            setUserImageVisible(userId, resp[2]);
            setUserImageVisible(userId, resp[4]);
            return {
                numberOfContacts: resp[0][0].numberOfContacts,
                numberOfSameContacts: resp[1][0].numberOfSameContacts,
                contacts: resp[2],
                numberOfContacting: resp[3][0].numberOfContacting,
                contacting: resp[4]
            };
        });

};


module.exports = {
    getContactInfo: getContactInfo
};
