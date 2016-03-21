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
    return db.cypher().match("(user:User {userId: {userId}})-[:WRITTEN|:RECOMMENDS]->(pinwall:PinwallElement)")
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

var getPinwallOfDetailUser = function (userId, request) {

    return db.cypher().match("(user:User {userId: {userId}}), " +
            "(privacyNoContact:Privacy)<-[:HAS_PRIVACY_NO_CONTACT]-(otherUser:User {userId: {detailUserId}})" +
            "-[:WRITTEN|:RECOMMENDS]->(pinwall:PinwallElement)")
        .optionalMatch("(pinwall)-[:PINWALL_DATA]->(pinwallData)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(otherUser)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .with("user, pinwall, pinwallData, otherUser, isContact, privacy, privacyNoContact, false AS isAdmin")
        .match("(pinwall)")
        .where("(NOT EXISTS(pinwall.visible) AND ANY(l IN LABELS(pinwall) WHERE l = 'Blog')) " +
            "OR (ANY(v IN pinwall.visible WHERE v = isContact.type) AND ANY(l IN LABELS(pinwall) WHERE l = 'Blog')) " +
            "OR ((NONE(l IN LABELS(pinwall) WHERE l = 'Blog') AND " +
            "(privacy.pinwall = true OR (NOT (otherUser)-[:IS_CONTACT]->(user) AND privacyNoContact.pinwall = true)) AND " +
            "(privacy.profile = true OR (NOT (otherUser)-[:IS_CONTACT]->(user) AND privacyNoContact.profile = true)))) " +
            "AND NOT (otherUser)-[:IS_BLOCKED]->(user)")
        .return("user, pinwall, pinwallData, otherUser AS contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact, isAdmin")
        .orderBy("pinwall.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({userId: userId, detailUserId: request.userId, skip: request.skip, maxItems: request.maxItems})
        .send()
        .then(function (resp) {
            return {pinwall: pinwallElement.getPinwallElements(resp)};
        });
};


var getPinwall = function (userId, request) {
    var commands = [];

    var showWhenUserPinwallElement = "(user)-[]->(pinwall) ";
    var showBlogOtherUserWhenPublic = "((user)-[:IS_CONTACT]->(contact) AND NOT EXISTS(pinwall.visible) AND " +
        "ANY(l IN LABELS(pinwall) WHERE l = 'Blog'))";
    var showBlogOtherUserPrivacySet = "((user)-[:IS_CONTACT]->(contact) AND ANY(v IN pinwall.visible WHERE v = isContact.type)" +
        " AND ANY(l IN LABELS(pinwall) WHERE l = 'Blog'))";
    var showOtherUserPinwallElements = "((user)-[:IS_CONTACT]->(contact) AND NONE(l IN LABELS(pinwall) WHERE l = 'Blog') AND " +
        "(privacy.pinwall = true OR (NOT (contact)-[:IS_CONTACT]->(user) AND privacyNoContact.pinwall = true)) AND " +
        "(privacy.profile = true OR (NOT (contact)-[:IS_CONTACT]->(user) AND privacyNoContact.profile = true)))";
    var notShowWhenUserIsBlocked = "NOT (contact)-[:IS_BLOCKED]->(user)";

    commands.push(unread.getUnreadMessages(userId).getCommand());
    commands.push(getContacting(userId).getCommand());
    commands.push(getNumberOfContacting(userId).getCommand());
    commands.push(getUserInfos(userId).getCommand());

    return db.cypher().match("(user:User {userId: {userId}})-[:IS_CONTACT|:WRITTEN|:RECOMMENDS*1..2]->(pinwall:PinwallElement)")
        .optionalMatch("(pinwall)-[:PINWALL_DATA]->(pinwallData)")
        .optionalMatch("(user)-[:IS_CONTACT]->(contact:User)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("(user)-[:IS_CONTACT]->(contact)-[:WRITTEN|:RECOMMENDS]->(pinwall) AND " + notShowWhenUserIsBlocked)
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(contact:User)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("(user)-[:IS_CONTACT]->(contact)-[:WRITTEN|:RECOMMENDS]->(pinwall) AND isContact.type = relPrivacy.type")
        .with("user, pinwall, pinwallData, contact, isContact, privacy, privacyNoContact, " +
            "EXISTS((user)-[:WRITTEN|:RECOMMENDS]->(pinwall)) AS isAdmin")
        .where("( " + showWhenUserPinwallElement + " OR " + showBlogOtherUserWhenPublic + " OR " + showBlogOtherUserPrivacySet + " OR " +
            showOtherUserPinwallElements + ")")
        .return("user, pinwall, pinwallData, contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact, isAdmin")
        .orderBy("pinwall.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
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
    getPinwallOfUser: getPinwallOfUser,
    getPinwallOfDetailUser: getPinwallOfDetailUser
};
