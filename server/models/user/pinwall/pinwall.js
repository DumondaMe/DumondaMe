'use strict';

var db = require('./../../../neo4j');
var userInfo = require('./../userInfo');
var pinwallElement = require('./pinwallElement/pinwallElement');
var pinwallSelector = require('./pinwallSelector');

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
        .return("user, pinwall, pinwallData, otherUser AS contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact, " +
            "NOT EXISTS(pinwall.visible) AS isPublic , isAdmin")
        .orderBy("pinwall.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({userId: userId, detailUserId: request.userId, skip: request.skip, maxItems: request.maxItems})
        .send()
        .then(function (resp) {
            return {pinwall: pinwallElement.getPinwallElements(resp)};
        });
};

var getBlogs = function (userId, request) {
    return db.cypher().match("(user:User {userId: {userId}})-[:IS_CONTACT|:WRITTEN*1..2]->(pinwall:Blog)")
        .where(`NOT (pinwall)<-[:WRITTEN]-(user)-[:IS_CONTACT]->(:User)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(pinwall) AND
                NOT (pinwall)<-[:WRITTEN]-(:User)<-[:IS_CONTACT]-(user)-[:IS_CONTACT|:RECOMMENDS*1..2]->(:Recommendation)-[:RECOMMENDS]->(pinwall)`)
        .optionalMatch("(user)-[hasContact:IS_CONTACT]->(contact:User)-[:WRITTEN]->(pinwall)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(contact)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .optionalMatch("(contact)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("privacy is NULL")
        .with(`user, contact, pinwall, isContact, hasContact, privacy, privacyNoContact,
               EXISTS((user)-[:WRITTEN]->(pinwall)) AS isAdmin`)
        .where(`((user)-[:WRITTEN]->(pinwall) OR (contact IS NOT null AND NOT EXISTS(pinwall.visible)) OR 
                (contact IS NOT null AND ANY(v IN pinwall.visible WHERE v = isContact.type))) AND NOT (contact)-[:IS_BLOCKED]->(user)`)
        .return("user, pinwall, contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact, isAdmin, NOT EXISTS(pinwall.visible) AS isPublic")
        .orderBy("pinwall.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({userId: userId, skip: request.skipBlog, maxItems: request.maxItems});
};

var getRecommendationPrivacyString = function (withCondition) {
    return db.cypher()
        .optionalMatch("(user)-[hasContact:IS_CONTACT]->(contact:User)-[:RECOMMENDS]->(pinwall)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(contact)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .optionalMatch("(contact)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("isContact is NULL")
        .with("user, contact, pinwall, pinwallData, isContact, hasContact, privacy, privacyNoContact" + withCondition)
        .where(`((user)-[:RECOMMENDS]->(pinwall) OR 
                (privacy.pinwall = true OR (privacy is null AND privacyNoContact.pinwall = true)) AND 
                (privacy.profile = true OR (privacy is null AND privacyNoContact.profile = true))) AND NOT (contact)-[:IS_BLOCKED]->(user)`)
        .getCommandString();
};

var getBlogRecommendationPrivacyString = function () {
    return db.cypher()
        .optionalMatch("(pinwallData)<-[:WRITTEN]-(writer:User)")
        .where("pinwallData:Blog")
        .optionalMatch("(writer)-[writerContact:IS_CONTACT]->(user)")
        .with(`user, contact, pinwall, pinwallData, isContact, hasContact, privacy, privacyNoContact, numberOfSamePinwallData, writer, writerContact`)
        .where(`writer is null OR (writer is not null AND
               (NOT EXISTS(pinwallData.visible) OR (ANY(v IN pinwallData.visible WHERE v = writerContact.type)) OR writer.userId = user.userId) 
                AND NOT EXISTS((writer)-[:IS_BLOCKED]->(user)))`)
        .getCommandString();
};

var getRecommendations = function (userId, request) {
    return db.cypher().match("(user:User {userId: {userId}})-[:IS_CONTACT|:RECOMMENDS*1..2]->(pinwall:Recommendation)-[:PINWALL_DATA]->(pinwallData)")
        .addCommand(getRecommendationPrivacyString(''))
        .with("count(pinwallData) AS numberOfSamePinwallData, max(pinwall.created) AS created, pinwallData")
        .orderBy("created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .match("(user:User {userId: {userId}})-[:IS_CONTACT|:RECOMMENDS*1..2]->(pinwall:Recommendation)-[:PINWALL_DATA]->(pinwallData)")
        .where("pinwall.created = created")
        .addCommand(getRecommendationPrivacyString(', numberOfSamePinwallData '))
        .addCommand(getBlogRecommendationPrivacyString())
        .return(`user, pinwall, pinwallData, contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact, numberOfSamePinwallData, writer,
            EXISTS((user)-[:RECOMMENDS]->()-[:RECOMMENDS]->(pinwallData)) AS userHasRecommended,
            EXISTS((user)-[:RECOMMENDS]->(pinwall)) AS thisRecommendationByUser`)
        .end({userId: userId, skip: request.skipRecommendation, maxItems: request.maxItems});
};


var getPinwall = function (userId, request) {
    var commands = [];

    commands.push(getContacting(userId).getCommand());
    commands.push(getNumberOfContacting(userId).getCommand());
    commands.push(getBlogs(userId, request).getCommand());

    return getRecommendations(userId, request)
        .send(commands)
        .then(function (resp) {
            var pinwall = pinwallSelector.sortPinwall(resp[2], resp[3], request.skipRecommendation, request.skipBlog, request.maxItems);
            userInfo.addImageForThumbnail(resp[0]);

            return {
                contacting: {users: resp[0], numberOfContacting: resp[1][0].numberOfContacting},
                pinwall: pinwallElement.getPinwallElements(pinwall.pinwall),
                skipRecommendation: pinwall.skipRecommendation,
                skipBlog: pinwall.skipBlog
            };
        });
};

module.exports = {
    getPinwall: getPinwall,
    getPinwallOfUser: getPinwallOfUser,
    getPinwallOfDetailUser: getPinwallOfDetailUser
};
