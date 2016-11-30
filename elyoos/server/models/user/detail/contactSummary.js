'use strict';

var userInfo = require('../userInfo');
var contact = require('./contact');
var contacting = require('./contacting');

var getContactInfo = function (userId, userDetailId, contactsPerPage, skipContacts) {
    var commands = [];

    commands.push(contact.numberOfContacts(userDetailId).getCommand());
    commands.push(contact.numberOfSameContacts(userId, userDetailId).getCommand());
    commands.push(contact.getContactsCommand(userId, userDetailId, contactsPerPage, skipContacts).getCommand());

    commands.push(contacting.numberOfContacting(userDetailId).getCommand());

    return contacting.getContactingCommand(userId, userDetailId, contactsPerPage, skipContacts).send(commands)
        .then(function (resp) {
            userInfo.setUserImageVisible(userId, resp[2]);
            userInfo.setUserImageVisible(userId, resp[4]);
            userInfo.addImageForPreview(resp[2]);
            userInfo.addImageForPreview(resp[4]);
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
