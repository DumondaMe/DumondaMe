/**
 * A model for the user
 */
'use strict';

var db = require('./../../neo4j');
var logger = requireLogger.getLogger(__filename);
var cdn = require('../util/cdn');
var underscore = require('underscore');

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
                return getUser(resp, id, [{property: 'profileImage', image: '/profile.jpg'}], req);
            });
    },
    updateUserProfile: function (userId, userData) {

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
    },
    getUserInfo: function (id, req) {
        return db.cypher().match('(u:User {userId: {id}})')
            .optionalMatch("(u)-[relPrivacy:HAS_PRIVACY]->(:Privacy)")
            .with("u, relPrivacy")
            .orderBy("relPrivacy.type")
            .return('u.name AS name, u.email AS email, collect(relPrivacy.type) AS privacyTypes')
            .end({id: id})
            .send()
            .then(function (resp) {
                return getUser(resp, id, [
                    {
                        property: 'profileImage',
                        image: '/thumbnail.jpg'
                    }, {
                        property: 'profileImagePreview',
                        image: '/profilePreview.jpg'
                    }], req);
            });
    }
};
