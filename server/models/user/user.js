/**
 * A model for the user
 */
'use strict';

var db = require('./../../neo4j');
var logger = requireLogger.getLogger(__filename);
var cdn = require('../util/cdn');
var moment = require('moment');

var getUser = function (resp, id, profileUrl) {
    if (resp.length === 1) {
        resp[0].profileImage = cdn.getUrl('profileImage/' + id + profileUrl);
        return resp[0];
    }
    if (resp.length > 1) {
        logger.error('More then one user with id ' + id);
    }
    if (resp.length === 0) {
        logger.error('User with id ' + id + ' not found');
    }
};

module.exports = {
    searchUserWithEmail: function (email) {
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
    },
    getUserProfile: function (id, req) {

        return db.cypher().match('(u:User {userId: {id}})')
            .return('u.forename AS forename, u.surname AS surname, u.userId AS id, u.email AS email, ' +
            'u.birthday AS birthday, u.street AS street, u.female AS female, u.country AS country, u.place AS place')
            .end({id: id})
            .send()
            .then(function (resp) {
                return getUser(resp, id, '/profile.jpg', req);
            });
    },
    updateUserProfile: function (userId, userData) {

        var name;
        if (userData.forename && userData.surname) {
            name = userData.forename + ' ' + userData.surname;
        }
        if (!userData.place) {
            userData.place = "";
        }
        if (!userData.street) {
            userData.street = "";
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
                name: name,
                id: userId,
                forename: userData.forename,
                surname: userData.surname,
                birthday: userData.birthday,
                place: userData.place,
                country: userData.country,
                street: userData.street,
                female: userData.female
            })
            .send();
    },
    getUserName: function (id, req) {
        return db.cypher().match('(u:User {userId: {id}})')
            .return('u.name AS name')
            .end({id: id})
            .send()
            .then(function (resp) {
                return getUser(resp, id, '/thumbnail.jpg', req);
            });
    }
};
