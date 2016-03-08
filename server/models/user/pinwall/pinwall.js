'use strict';

var db = require('./../../../neo4j');
var userInfo = require('./../userInfo');
var pinwallElement = require('./pinwallElement/pinwallElement');
var unread = require('../../messages/util/unreadMessages');
var cdn = require('../../util/cdn');

var getContacting = function (userId) {
    return db.cypher().match("(user:User {userId: {userId}})<-[relContacting:IS_CONTACT]-(contacting:User)")
        .where("relContacting.contactAdded >= user.previousLastLogin")
        .with("contacting, relContacting, user")
        .match("(contacting)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contacting)")
        .with("contacting, relContacting, rContact, v, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("contacting.userId AS userId, contacting.name AS name, relContacting.contactAdded AS contactAdded, " +
            "v.profile AS profileVisible, v.image AS imageVisible")
        .orderBy("contactAdded DESC")
        .limit("3")
        .end({userId: userId});
};

var getNumberOfContacting = function (userId) {
    return db.cypher().match("(user:User {userId: {userId}})<-[relContacting:IS_CONTACT]-(contacting:User)")
        .where("relContacting.contactAdded >= user.previousLastLogin")
        .return("count(*) AS numberOfContacting")
        .end({userId: userId});
};

var getUserInfos = function (userId) {
    return db.cypher().match("(user:User {userId: {userId}})-[type:HAS_PRIVACY]->(:Privacy)")
        .return("type.type AS type")
        .orderBy("type")
        .end({userId: userId});
};

var getPinwallOfUser = function (userId, request) {
    return db.cypher().match("(pinwall:PinwallElement), (user:User {userId: {userId}})")
        .where("(user)-[:WRITTEN|:RECOMMENDS]->(pinwall)")
        .optionalMatch("(pinwall)-[:PINWALL_DATA]->(pinwallData)")
        .return("user, pinwall, pinwallData, LABELS(pinwall) AS pinwallType, true AS isAdmin")
        .orderBy("pinwall.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({userId: userId, skip: request.skip, maxItems: request.maxItems})
        .send()
        .then(function (resp) {
            return {pinwall: pinwallElement.getPinwallElements(resp)};
        });
};

var getPinwall = function (userId, request) {
    var commands = [];

    commands.push(unread.getUnreadMessages(userId).getCommand());
    commands.push(getContacting(userId).getCommand());
    commands.push(getNumberOfContacting(userId).getCommand());
    commands.push(getUserInfos(userId).getCommand());

    return db.cypher().match("(pinwall:PinwallElement), (user:User {userId: {userId}})")
        .where("(user)-[]->(pinwall) OR (user)-[:IS_CONTACT]->(:User)-[]->(pinwall)")
        .optionalMatch("(pinwall)-[:PINWALL_DATA]->(pinwallData)")
        .optionalMatch("(user)-[:IS_CONTACT]->(contact:User)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("(user)-[:IS_CONTACT]->(contact)-[]->(pinwall)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(contact:User)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("(user)-[:IS_CONTACT]->(contact)-[]->(pinwall) AND isContact.type = relPrivacy.type")
        .with("user, pinwall, pinwallData, contact, isContact, privacy, privacyNoContact, EXISTS((user)-[]->(pinwall)) AS isAdmin")
        .orderBy("pinwall.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .match("(pinwall)")
        .where("((user)-[]->(pinwall) OR (EXISTS((user)-[:IS_CONTACT]->(contact)) AND NOT EXISTS(pinwall.privacy)) " +
            "OR (EXISTS((user)-[:IS_CONTACT]->(contact)) AND pinwall.privacy = isContact.type)) " +
            "AND NOT EXISTS((contact)-[:IS_BLOCKED]->(user))")
        .return("user, pinwall, pinwallData, contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact, isAdmin")
        .end({userId: userId, skip: request.skip, maxItems: request.maxItems})
        .send(commands)
        .then(function (resp) {
            userInfo.addImageForThumbnail(resp[0]);
            userInfo.addImageForThumbnail(resp[1]);

            return {
                messages: resp[0],
                contacting: {users: resp[1], numberOfContacting: resp[2][0].numberOfContacting},
                pinwall: pinwallElement.getPinwallElements(resp[4]),
                user: {privacyTypes: resp[3], profileUrl: cdn.getUrl('profileImage/' + userId + '/profilePreview.jpg')}
            };
        });
};

module.exports = {
    getPinwall: getPinwall,
    getPinwallOfUser: getPinwallOfUser
};
