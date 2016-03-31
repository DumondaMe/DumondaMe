/**
 * A model for the user
 */
'use strict';

var db = require('./../../neo4j');
var logger = requireLogger.getLogger(__filename);
var cdn = require('../util/cdn');
var underscore = require('underscore');
var unreadMessages = require('./../messages/util/unreadMessages');
var contacting = require('./../contact/contacting');
var contactStatistic = require('./../contact/contactStatistic');

var getUser = function (resp, id, profileUrls, req) {
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

var searchUserWithEmail = function (email) {
    return db.cypher().match('(u:User {email: {email}})')
        .return('u.password AS password, u.email AS email, u.userId AS id')
        .end({email: email})
        .send()
        .then(function (resp) {
            if (resp.length === 1) {
                return resp[0];
            }
            if (resp.length > 1) {
                logger.error('More then one user with email address ' + email);
            }
        });
};

var getUserProfile = function (id, req) {

    var commands = [];
    commands.push(contacting.getContactingStatistics(id).getCommand());
    commands.push(contactStatistic.getTotalNumberOfContacts(id).getCommand());

    return db.cypher().match('(u:User {userId: {id}})')
        .return('u.forename AS forename, u.surname AS surname, u.userId AS id, u.email AS email, ' +
            'u.birthday AS birthday, u.street AS street, u.female AS female, u.country AS country, u.place AS place')
        .end({id: id})
        .send(commands)
        .then(function (resp) {
            var profile = getUser(resp[2], id, [{property: 'profileImage', image: '/profile.jpg'}], req);
            profile.numberOfContacting = resp[0][0].count;
            profile.numberOfContacts = resp[1][0].numberOfContacts;
            return profile;
        });
};

var updateUserProfile = function (userId, userData) {

    var name;
    if (userData.forename && userData.surname) {
        name = userData.forename + ' ' + userData.surname;
    }
    return db.cypher().match('(u:User {userId: {id}})')
        .set('u', {
            name: name,
            forename: userData.forename,
            surname: userData.surname,
            birthday: userData.birthday,
            place: userData.place,
            country: userData.country,
            street: userData.street,
            female: userData.female
        })
        .end({
            id: userId
        })
        .send();
};

var getUserInfo = function (id, req) {

    var commands = [];

    commands.push(unreadMessages.getTotalNumberOfUnreadMessages(id).getCommand());

    return db.cypher().match('(u:User {userId: {id}})')
        .optionalMatch("(u)-[relPrivacy:HAS_PRIVACY]->(:Privacy)")
        .with("u, relPrivacy")
        .orderBy("relPrivacy.type")
        .return('u.name AS name, u.email AS email, collect(relPrivacy.type) AS privacyTypes')
        .end({id: id})
        .send(commands)
        .then(function (resp) {
            var user = getUser(resp[1], id, [
                {
                    property: 'profileImage',
                    image: '/thumbnail.jpg'
                }, {
                    property: 'profileImagePreview',
                    image: '/profilePreview.jpg'
                }], req);
            user.totalUnreadMessages = resp[0][0].totalUnreadMessages;
            return user;
        });
};

module.exports = {
    searchUserWithEmail: searchUserWithEmail,
    getUserProfile: getUserProfile,
    updateUserProfile: updateUserProfile,
    getUserInfo: getUserInfo
};
