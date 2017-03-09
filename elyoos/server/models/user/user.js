/**
 * A model for the user
 */
'use strict';

let db = requireDb();
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let cdn = require('elyoos-server-lib').cdn;
let underscore = require('underscore');
let unreadMessages = require('./../messages/util/unreadMessages');
let contacting = require('./../contact/contacting');
let contactStatistic = require('./../contact/contactStatistic');

let getUser = function (resp, id, profileUrls, req) {
    if (resp.length === 1) {
        underscore.forEach(profileUrls, function (profileUrl) {
            resp[0][profileUrl.property] = cdn.getUrl('profileImage/' + id + profileUrl.image);
        });
        return resp[0];
    }
    if (resp.length > 1) {
        logger.error('More then one user with id ' + id, req);
    }
    if (resp.length === 0) {
        logger.error('User with id ' + id + ' not found', req);
    }
};

let getUserProfile = function (id, req) {

    let commands = [];
    commands.push(contacting.getContactingStatistics(id).getCommand());
    commands.push(contactStatistic.getTotalNumberOfContacts(id).getCommand());

    return db.cypher().match('(u:User {userId: {id}})')
        .return('u.forename AS forename, u.surname AS surname, u.userId AS id, u.email AS email')
        .end({id: id}).send(commands)
        .then(function (resp) {
            let profile = getUser(resp[2], id, [{property: 'profileImage', image: '/profile.jpg'}], req);
            profile.numberOfContacting = resp[0][0].count;
            profile.numberOfContacts = resp[1][0].numberOfContacts;
            return profile;
        });
};

let updateUserProfile = function (userId, userData) {

    let name;
    if (userData.forename && userData.surname) {
        name = userData.forename + ' ' + userData.surname;
    }
    return db.cypher().match('(u:User {userId: {id}})')
        .set('u', {
            name: name,
            forename: userData.forename,
            surname: userData.surname
        }).end({id: userId}).send();
};

let getUserInfo = function (id, req) {

    let commands = [];
    commands.push(unreadMessages.getTotalNumberOfUnreadMessages(id).getCommand());
    commands.push(contactStatistic.getContactStatisticsCommand(id).getCommand());

    return db.cypher().match('(u:User {userId: {id}})')
        .return('u.name AS name, u.userId AS userId, u.email AS email')
        .end({id: id}).send(commands)
        .then(function (resp) {
            let user = getUser(resp[2], id, [
                {
                    property: 'profileImage',
                    image: '/thumbnail.jpg'
                }, {
                    property: 'profileImagePreview',
                    image: '/profilePreview.jpg'
                }], req);
            user.totalUnreadMessages = resp[0][0].totalUnreadMessages;
            user.contactStatistic = resp[1];
            return user;
        });
};

module.exports = {
    getUserProfile: getUserProfile,
    updateUserProfile: updateUserProfile,
    getUserInfo: getUserInfo
};
