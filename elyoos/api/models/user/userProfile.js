/**
 * A model for the user
 */
'use strict';

let db = requireDb();
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let cdn = require('elyoos-server-lib').cdn;
let contacting = require('./../contact/contacting');
let contact = require('./detail/contact');
let userInfo = require('./userInfo');

let getUser = async function (resp, id, profileUrls, req) {
    if (resp.length === 1) {
        for (let profileUrl of profileUrls) {
            resp[0][profileUrl.property] = await cdn.getSignedUrl('profileImage/' + id + profileUrl.image);
        }
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
    commands.push(contact.numberOfContacts(id, id).getCommand());
    commands.push(contact.getContactsCommand(id, id, 10, 0).getCommand());

    return db.cypher().match(`(u:User {userId: {id}})`)
        .return(`u.forename AS forename, u.surname AS surname, u.userId AS id, u.email AS email, 
                 u.privacyMode AS privacyMode`)
        .end({id: id}).send(commands)
        .then(async function (resp) {
            let profile = await getUser(resp[3], id, [{property: 'profileImage', image: '/profile.jpg'}], req);
            profile.numberOfContacting = resp[0][0].count;
            profile.numberOfContacts = resp[1][0].numberOfContacts;
            await userInfo.addImageForThumbnail(resp[2]);
            profile.contacts = resp[2];
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

module.exports = {
    getUserProfile: getUserProfile,
    updateUserProfile: updateUserProfile
};
