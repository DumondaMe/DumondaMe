'use strict';

let db = requireDb();
let userInfo = require('./../userInfo');
let pinwallFilter = require('./pinwallFilter');
let pinwallElement = require('./pinwallElement/pinwallElement');
let pinwallSelector = require('./pinwallSelector');
let contacting = require('./contacting');
let recommendedUser = require('./recommendedUser');
let recommendedUserSetting = require('./../setting/recommendedUser');

let getPinwallOfUser = function (userId, request) {
    return db.cypher().match("(user:User {userId: {userId}})-[:WRITTEN|:RECOMMENDS]->(pinwall:PinwallElement)")
        .optionalMatch("(pinwall)-[:PINWALL_DATA]->(pinwallData)")
        .optionalMatch("(pinwallData)<-[:WRITTEN]-(writer:User)")
        .where("pinwallData:Blog")
        .optionalMatch("(user)-[:RECOMMENDS]->(userRec:Recommendation)-[:RECOMMENDS]->(pinwallData)")
        .return(`user, pinwall, pinwallData, LABELS(pinwall) AS pinwallType, true AS isAdmin, writer,
                 userRec.recommendationId AS userRecommendationId, NOT EXISTS(pinwall.visible) AS isPublic,
                 EXISTS((user)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(pinwallData)) AS recommendedByUser,
                 EXISTS((user)-[:RECOMMENDS]->(pinwall)) AS thisRecommendationByUser,
                 SIZE((pinwallData)<-[:RECOMMENDS]-(:Recommendation)) AS numberOfPinwallDataRecommendations,
                 SIZE((pinwall)<-[:RECOMMENDS]-(:Recommendation)) AS numberOfPinwallRecommendations`)
        .orderBy("pinwall.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({userId: userId, skip: request.skip, maxItems: request.maxItems})
        .send()
        .then(function (resp) {
            return {pinwall: pinwallElement.getPinwallElements(resp)};
        });
};

let getPinwallOfDetailUser = function (userId, request) {

    return db.cypher().match("(user:User {userId: {userId}}), " +
        "(privacyNoContact:Privacy)<-[:HAS_PRIVACY_NO_CONTACT]-(otherUser:User {userId: {detailUserId}})" +
        "-[:WRITTEN|:RECOMMENDS]->(pinwall:PinwallElement)")
        .optionalMatch("(pinwall)-[:PINWALL_DATA]->(pinwallData)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(otherUser)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .optionalMatch("(pinwallData)<-[:WRITTEN]-(writer:User)")
        .where("pinwallData:Blog")
        .optionalMatch("(writer)-[writerContact:IS_CONTACT]->(user)")
        .optionalMatch("(user)-[:RECOMMENDS]->(userRec:Recommendation)-[:RECOMMENDS]->(pinwallData)")
        .optionalMatch("(user)-[:RECOMMENDS]->(userRecBlog:Recommendation)-[:RECOMMENDS]->(pinwall)")
        .where("pinwall:Blog")
        .with(`user, pinwall, pinwallData, otherUser, isContact, privacy, privacyNoContact, false AS isAdmin, userRec, userRecBlog, writer, 
               writerContact`)
        .where(`(NOT EXISTS(pinwall.visible) AND ANY(l IN LABELS(pinwall) WHERE l = 'Blog'))
                 OR (ANY(v IN pinwall.visible WHERE v = isContact.type) AND ANY(l IN LABELS(pinwall) WHERE l = 'Blog'))
                 OR ((NONE(l IN LABELS(pinwall) WHERE l = 'Blog') AND
                (writer is null OR (writer is not null AND
                (NOT EXISTS(pinwallData.visible) OR (ANY(v IN pinwallData.visible WHERE v = writerContact.type)) OR writer.userId = user.userId))) AND
                (privacy.pinwall = true OR (NOT (otherUser)-[:IS_CONTACT]->(user) AND privacyNoContact.pinwall = true)) AND
                (privacy.profile = true OR (NOT (otherUser)-[:IS_CONTACT]->(user) AND privacyNoContact.profile = true))))
                 AND NOT (otherUser)-[:IS_BLOCKED]->(user)`)
        .return(`user, pinwall, pinwallData, otherUser AS contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact, writer,
                 NOT EXISTS(pinwall.visible) AS isPublic , isAdmin, userRec.recommendationId AS userRecommendationId,
                 userRecBlog.recommendationId AS userBlogRecommendationId,
                 EXISTS((user)-[:RECOMMENDS]->(pinwall)) AS thisRecommendationByUser,
                 SIZE((pinwallData)<-[:RECOMMENDS]-(:Recommendation)) AS numberOfPinwallDataRecommendations,
                 SIZE((pinwall)<-[:RECOMMENDS]-(:Recommendation)) AS numberOfPinwallRecommendations`)
        .orderBy("pinwall.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({userId: userId, detailUserId: request.userId, skip: request.skip, maxItems: request.maxItems})
        .send()
        .then(function (resp) {
            return {pinwall: pinwallElement.getPinwallElements(resp)};
        });
};

let getBlogOnlyContactFilter = function (onlyContact) {
    if (onlyContact) {
        return "(user:User {userId: {userId}})-[:IS_CONTACT|:WRITTEN*1..2]->(pinwall:Blog)";
    }
    return "(user:User {userId: {userId}}), (contact:User)-[:WRITTEN]->(pinwall:Blog)";
};

let getBlogs = function (userId, request) {
    let filters = pinwallFilter.getFilters(request, 'pinwall');
    return db.cypher().match(getBlogOnlyContactFilter(request.onlyContact))
        .where(filters)
        .optionalMatch("(user)-[hasContact:IS_CONTACT]->(contact)-[:WRITTEN]->(pinwall)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(contact)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .optionalMatch("(contact)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("privacy is NULL")
        .optionalMatch("(pinwall)<-[:RECOMMENDS]-(recommendation:Recommendation)")
        .with(`user, contact, pinwall, isContact, hasContact, privacy, privacyNoContact, count(recommendation) AS numberOfRecommendations, 
               EXISTS((user)-[:WRITTEN]->(pinwall)) AS isAdmin`)
        .where(`((user)-[:WRITTEN]->(pinwall) OR (contact IS NOT null AND NOT EXISTS(pinwall.visible)) OR 
                (contact IS NOT null AND ANY(v IN pinwall.visible WHERE v = isContact.type))) AND NOT (contact)-[:IS_BLOCKED]->(user)`)
        .optionalMatch("(user)-[:RECOMMENDS]->(userRec:Recommendation)-[:RECOMMENDS]->(pinwall)")
        .return(`user, numberOfRecommendations, pinwall, contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact, isAdmin, 
                 NOT EXISTS(pinwall.visible) AS isPublic, userRec.recommendationId AS userRecommendationId,
                 EXISTS((user)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(pinwall)) AS recommendedByUser`)
        .orderBy("pinwall.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({
            userId: userId, skip: request.skipBlog, maxItems: request.maxItems, language: request.language, topic: request.topic,
            recommendationType: request.recommendationType
        });
};

let getRecommendationPrivacyString = function (withCondition) {
    return db.cypher().optionalMatch("(user)-[hasContact:IS_CONTACT]->(contact)-[:RECOMMENDS]->(pinwall)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(contact)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .optionalMatch("(contact)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("isContact is NULL")
        .with("user, contact, pinwall, pinwallData, isContact, hasContact, privacy, privacyNoContact" + withCondition)
        .where(`(user)-[:RECOMMENDS]->(pinwall) OR 
                ((privacy.pinwall = true OR (privacy is null AND privacyNoContact.pinwall = true)) AND 
                (privacy.profile = true OR (privacy is null AND privacyNoContact.profile = true)) AND NOT (contact)-[:IS_BLOCKED]->(user))`)
        .getCommandString();
};

let getBlogRecommendationPrivacyString = function () {
    return db.cypher().optionalMatch("(pinwallData)<-[:WRITTEN]-(writer:User)")
        .where("pinwallData:Blog")
        .optionalMatch("(writer)-[writerContact:IS_CONTACT]->(user)")
        .with(`user, contact, pinwall, pinwallData, isContact, hasContact, privacy, privacyNoContact, numberOfSamePinwallData, writer, writerContact`)
        .where(`writer is null OR (writer is not null AND
               (NOT EXISTS(pinwallData.visible) OR (ANY(v IN pinwallData.visible WHERE v = writerContact.type)) OR writer.userId = user.userId) 
                AND NOT EXISTS((writer)-[:IS_BLOCKED]->(user)))`)
        .getCommandString();
};

let getRecommendationOnlyContactFilter = function (onlyContact) {
    if (onlyContact) {
        return "(user:User {userId: {userId}})-[:IS_CONTACT|:RECOMMENDS*1..2]->(pinwall:Recommendation)-[:PINWALL_DATA]->(pinwallData)";
    }
    return "(user:User {userId: {userId}}), (contact:User)-[:RECOMMENDS]->(pinwall:Recommendation)-[:PINWALL_DATA]->(pinwallData)";
};

let getFilterWithCreatedCondition = function (filters) {
    if(filters) {
        return `pinwall.created = created AND ${filters}`;
    }
    return `pinwall.created = created`;
};

let getRecommendations = function (userId, request) {
    let filters = pinwallFilter.getFilters(request, 'pinwallData');
    return db.cypher().match(getRecommendationOnlyContactFilter(request.onlyContact))
        .where(filters)
        .addCommand(getRecommendationPrivacyString(''))
        .with("count(pinwallData) AS numberOfSamePinwallData, max(pinwall.created) AS created, pinwallData")
        .orderBy("created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .match(getRecommendationOnlyContactFilter(request.onlyContact))
        .where(getFilterWithCreatedCondition(filters))
        .addCommand(getRecommendationPrivacyString(', numberOfSamePinwallData '))
        .addCommand(getBlogRecommendationPrivacyString())
        .optionalMatch("(user)-[:RECOMMENDS]->(userRec:Recommendation)-[:RECOMMENDS]->(pinwallData)")
        .return(`user, pinwall, pinwallData, contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact, numberOfSamePinwallData, writer,
            userRec.recommendationId AS userRecommendationId,
            EXISTS((user)-[:RECOMMENDS]->(pinwall)) AS thisRecommendationByUser,
            SIZE((pinwallData)<-[:RECOMMENDS]-(:Recommendation)) AS numberOfRecommendations`)
        .end({
            userId: userId, skip: request.skipRecommendation, maxItems: request.maxItems, language: request.language, topic: request.topic,
            recommendationType: request.recommendationType
        });
};


let getPinwall = function (userId, request) {
    let commands = [];

    return recommendedUserSetting.showUserRecommendationOnHome(userId).then(function (showUserRecommendation) {
        commands.push(contacting.getContacting(userId).getCommand());
        commands.push(contacting.getNumberOfContacting(userId).getCommand());
        if (showUserRecommendation) {
            commands.push(recommendedUser.getRecommendedByContactUsers(userId, 10).getCommand());
            commands.push(recommendedUser.getRecommendedUsers(userId, 10).getCommand());
        }
        commands.push(getBlogs(userId, request).getCommand());

        return getRecommendations(userId, request)
            .send(commands)
            .then(function (resp) {
                let pinwall, recommendedUserResult = [];
                userInfo.addImageForThumbnail(resp[0]);
                if (showUserRecommendation) {
                    userInfo.addImageForThumbnail(resp[2]);
                    userInfo.addImageForThumbnail(resp[3]);
                    recommendedUserResult = resp[2].concat(resp[3]);
                    pinwall = pinwallSelector.sortPinwall(resp[4], resp[5], request.skipRecommendation, request.skipBlog, request.maxItems);
                } else {
                    pinwall = pinwallSelector.sortPinwall(resp[2], resp[3], request.skipRecommendation, request.skipBlog, request.maxItems);
                }

                return {
                    contacting: {users: resp[0], numberOfContacting: resp[1][0].numberOfContacting},
                    recommendedUser: recommendedUserResult,
                    pinwall: pinwallElement.getPinwallElements(pinwall.pinwall),
                    skipRecommendation: pinwall.skipRecommendation,
                    skipBlog: pinwall.skipBlog
                };
            });
    });
};

module.exports = {
    getPinwall: getPinwall,
    getPinwallOfUser: getPinwallOfUser,
    getPinwallOfDetailUser: getPinwallOfDetailUser
};
