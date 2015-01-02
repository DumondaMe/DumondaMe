/**
 * A model for the user
 */
'use strict';

var db = require('./../../neo4j');
var logger = requireLogger.getLogger(__filename);


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
    searchUserWithId: function (id) {

        return db.cypher().match('(u:User {userId: {id}})')
            .return('u.forename AS forename, u.surname AS surname, u.userId AS id, u.email AS email, ' +
            'u.birthday AS birthday, u.street AS street, u.female AS female, u.country AS country, u.place AS place')
            .end({id: id})
            .send()
            .then(function (resp) {
                if (resp.length === 1) {
                    return resp[0];
                }
                if (resp.length > 1) {
                    logger.error('More then one user with id ' + id);
                }
                if (resp.length === 0) {
                    logger.error('User with id ' + id + ' not found');
                }
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
                female: userData.female
            })
            .send();
    }
};
