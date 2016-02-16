'use strict';

var db = require('./../../../neo4j');
var cdn = require('../../util/cdn');
var userInfo = require('../userInfo');
var contact = require('./contact');
var _ = require("lodash");
var logger = requireLogger.getLogger(__filename);

var returnContactDetails = function (resp, userId, detailUserId, req) {
    var detailUserData = resp[0];
    var detailUserPrivacy = resp[0].privacy;
    var detailUser = {
        name: detailUserData.detailUser.name,
        female: detailUserData.detailUser.female,
        type: detailUserData.type,
        contactAdded: detailUserData.contactAdded,
        userAdded: detailUserData.userAdded
    };
    userInfo.addConnectionInfo(detailUserData);
    detailUser.connected = detailUserData.connected;

    if (detailUserPrivacy.profile) {
        if (detailUserPrivacy.image) {
            detailUser.profileUrl = cdn.getUrl('profileImage/' + detailUserId + '/profile.jpg');
        } else {
            detailUser.profileUrl = cdn.getUrl('profileImage/default/profile.jpg');
        }
        if (detailUserPrivacy.profileData) {
            detailUser.birthday = detailUserData.detailUser.birthday;
            detailUser.country = detailUserData.detailUser.country;
            detailUser.place = detailUserData.detailUser.place;
            detailUser.street = detailUserData.detailUser.street;
        }
        if (detailUserPrivacy.contacts) {
            logger.debug('Get detail of user ' + detailUserId + ' with contacts', req);
            return contact.getContacts(userId, detailUserId, 9, 0).then(function (contact) {
                contact.user = _.omitBy(detailUser, _.isUndefined);
                return contact;
            });
        }
    } else {
        detailUser.profileUrl = cdn.getUrl('profileImage/default/profile.jpg');
    }
    logger.debug('Get detail of user ' + detailUserId + ' without contacts', req);
    detailUser = _.omitBy(detailUser, _.isUndefined);
    return {user: detailUser, contacts: []};
};

var getUserDetails = function (userId, requestUserDetailId, req) {

    var commands = [];

    return db.cypher().match('(detailUser:User {userId: {requestUserDetailId}}), (user:User {userId: {userId}})')
        .optionalMatch('(user)-[isContact:IS_CONTACT]->(detailUser)')
        .with('user, detailUser, isContact')
        .match("(detailUser)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch('(user)<-[contactHasUserContacted:IS_CONTACT]-(detailUser)')
        .with("user, detailUser, isContact, contactHasUserContacted, privacy, vr")
        .where("(contactHasUserContacted IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR " +
            "(contactHasUserContacted.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return('detailUser, isContact.type AS type, contactHasUserContacted.type AS contactType, ' +
            'isContact.contactAdded AS contactAdded, contactHasUserContacted.contactAdded AS userAdded, privacy')
        .end({userId: userId, requestUserDetailId: requestUserDetailId})
        .send(commands)
        .then(function (resp) {
            return returnContactDetails(resp, userId, requestUserDetailId, req);
        });
};


module.exports = {
    getUserDetails: getUserDetails
};
