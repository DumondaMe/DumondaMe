'use strict';

let db = requireDb();
let userInfo = require('./../userInfo');
let pinwallFilter = require('./pinwallFilter');
let pinwallElement = require('./pinwallElement/pinwallElement');
let pinwallSelector = require('./pinwallSelector');
let contacting = require('./contacting');
let recommendedUser = require('./recommendedUser');
let recommendedUserSetting = require('./../setting/recommendedUser');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let getRecommendationOfUser = function (userId, request) {
    return db.cypher().match("(user:User {userId: {userId}})-[:RECOMMENDS]->(pinwall:Recommendation)-[:RECOMMENDS]->(pinwallData)")
        .optionalMatch("(pinwallData)<-[:WRITTEN]-(writer:User)")
        .return(`user, pinwall, pinwallData, LABELS(pinwall) AS pinwallType, writer, true AS recommendedByUser, true AS thisRecommendationByUser,
                 pinwall.recommendationId AS userRecommendationId, NOT EXISTS(pinwall.visible) AS isPublic,
                 EXISTS((user)-[:IS_ADMIN]->(pinwallData)) AS isAdmin,
                 SIZE((pinwallData)<-[:RECOMMENDS]-(:Recommendation)) AS numberOfPinwallDataRecommendations`)
        .orderBy("pinwall.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({userId: userId, skip: request.skip, maxItems: request.maxItems})
        .send()
        .then(function (resp) {
            return {pinwall: pinwallElement.getPinwallElements(resp)};
        });
};

let getPagesOfUserOrder = function (type) {
    if(type === 'adminPopular') {
        return "totalNumberOfRecommendations DESC, page.created DESC";
    }
    return "page.created DESC";
};

let getPagesOfUser = function (userId, request) {
    return db.cypher().match("(user:User {userId: {userId}})-[:IS_ADMIN|WRITTEN]->(page:Page)")
        .optionalMatch("(user)-[:RECOMMENDS]->(recommendation:Recommendation)-[:RECOMMENDS]->(page)")
        .return(`user, page, LABELS(page) AS pinwallType, true AS isAdminType, NOT EXISTS(page.visible) AS isPublic, 
                 recommendation.recommendationId AS userRecommendationId,
                 SIZE((page)<-[:RECOMMENDS]-(:Recommendation)) AS totalNumberOfRecommendations`)
        .orderBy(getPagesOfUserOrder(request.type))
        .skip("{skip}")
        .limit("{maxItems}")
        .end({userId: userId, skip: request.skip, maxItems: request.maxItems})
        .send()
        .then(function (resp) {
            return {pinwall: pinwallElement.getPinwallElements(resp)};
        });
};

let getRecommendationOfOtherUser = function (userId, request) {

    return db.cypher().match(`(user:User {userId: {userId}}), (privacyNoContact:Privacy)<-[:HAS_PRIVACY_NO_CONTACT]-
                              (otherUser:User {userId: {detailUserId}})-[:RECOMMENDS]->(pinwall:PinwallElement)-[:PINWALL_DATA]->(pinwallData)`)
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(otherUser)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .with(`user, pinwall, pinwallData, otherUser, isContact, privacy, privacyNoContact`)
        .where(`((NOT EXISTS(pinwallData.visible) AND ANY(l IN LABELS(pinwallData) WHERE l = 'Blog'))
                 OR (ANY(v IN pinwallData.visible WHERE v = isContact.type) AND ANY(l IN LABELS(pinwall) WHERE l = 'Blog'))
                 OR (NONE(l IN LABELS(pinwallData) WHERE l = 'Blog'))) AND
                (privacy.pinwall = true OR (NOT (otherUser)-[:IS_CONTACT]->(user) AND privacyNoContact.pinwall = true)) AND
                (privacy.profile = true OR (NOT (otherUser)-[:IS_CONTACT]->(user) AND privacyNoContact.profile = true))
                 AND NOT (otherUser)-[:IS_BLOCKED]->(user)`)
        .optionalMatch("(user)-[:RECOMMENDS]->(userRec:Recommendation)-[:RECOMMENDS]->(pinwallData)")
        .optionalMatch("(writer)-[:WRITTEN]->(pinwallData)")
        .return(`user, pinwall, pinwallData, otherUser AS contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact,
                 NOT EXISTS(pinwallData.visible) AS isPublic, userRec.recommendationId AS userRecommendationId, writer,
                 SIZE((pinwallData)<-[:RECOMMENDS]-(:Recommendation)) AS numberOfPinwallDataRecommendations`)
        .orderBy("pinwall.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({userId: userId, detailUserId: request.userId, skip: request.skip, maxItems: request.maxItems})
        .send()
        .then(function (resp) {
            return {pinwall: pinwallElement.getPinwallElements(resp)};
        });
};

let getPagesOfOtherUserOrder = function (type) {
    if(type === 'adminPopular') {
        return "totalNumberOfRecommendations DESC, page.created DESC";
    }
    return "page.created DESC";
};

let getPagesOfOtherUser = function (userId, request) {

    return db.cypher().match(`(user:User {userId: {userId}}), (privacyNoContact:Privacy)<-[:HAS_PRIVACY_NO_CONTACT]-
                              (otherUser:User {userId: {detailUserId}})-[:WRITTEN|:IS_ADMIN]->(page:Page)`)
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(otherUser)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .with(`user, page, otherUser, isContact, privacy, privacyNoContact`)
        .where(`((NOT EXISTS(page.visible) AND ANY(l IN LABELS(page) WHERE l = 'Blog'))
                 OR (ANY(v IN page.visible WHERE v = isContact.type) AND ANY(l IN LABELS(page) WHERE l = 'Blog'))
                 OR ((NONE(l IN LABELS(page) WHERE l = 'Blog')))) AND
                (privacy.pinwall = true OR (NOT (otherUser)-[:IS_CONTACT]->(user) AND privacyNoContact.pinwall = true)) AND
                (privacy.profile = true OR (NOT (otherUser)-[:IS_CONTACT]->(user) AND privacyNoContact.profile = true))
                 AND NOT (otherUser)-[:IS_BLOCKED]->(user)`)
        .optionalMatch("(user)-[:RECOMMENDS]->(recommendation:Recommendation)-[:RECOMMENDS]->(page)")
        .return(`user, page, otherUser AS contact, LABELS(page) AS pinwallType, privacy, privacyNoContact, true AS isAdminType,
                 NOT EXISTS(page.visible) AS isPublic, recommendation.recommendationId AS userRecommendationId,
                 SIZE((page)<-[:RECOMMENDS]-(:Recommendation)) AS totalNumberOfRecommendations`)
        .orderBy(getPagesOfOtherUserOrder(request.type))
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
        .with(`user, contact, pinwall, isContact, hasContact, privacy, privacyNoContact, count(recommendation) AS totalNumberOfRecommendations, 
               EXISTS((user)-[:WRITTEN]->(pinwall)) AS isAdmin`)
        .where(`((user)-[:WRITTEN]->(pinwall) OR (contact IS NOT null AND NOT EXISTS(pinwall.visible)) OR 
                (contact IS NOT null AND ANY(v IN pinwall.visible WHERE v = isContact.type))) AND NOT (contact)-[:IS_BLOCKED]->(user)`)
        .optionalMatch("(user)-[:RECOMMENDS]->(userRec:Recommendation)-[:RECOMMENDS]->(pinwall)")
        .return(`user, totalNumberOfRecommendations, pinwall, contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact, isAdmin, 
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
        .with(`user, contact, pinwall, pinwallData, isContact, hasContact, privacy, privacyNoContact, numberOfRecommendations, writer, writerContact`)
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

let getRecommendationOrderFilter = function (order) {
    if (order === 'popular') {
        return "numberOfRecommendations DESC, created DESC";
    }
    return "created DESC";
};

let getFilterWithCreatedCondition = function (filters) {
    if (filters) {
        return `pinwall.created = created AND ${filters}`;
    }
    return `pinwall.created = created`;
};

let getRecommendations = function (userId, request) {
    let filters = pinwallFilter.getFilters(request, 'pinwallData');
    return db.cypher().match(getRecommendationOnlyContactFilter(request.onlyContact))
        .where(filters)
        .addCommand(getRecommendationPrivacyString(''))
        .with("count(pinwall) AS numberOfRecommendations, max(pinwall.created) AS created, pinwallData")
        .orderBy(getRecommendationOrderFilter(request.order))
        .skip("{skip}")
        .limit("{maxItems}")
        .match(getRecommendationOnlyContactFilter(request.onlyContact))
        .where(getFilterWithCreatedCondition(filters))
        .addCommand(getRecommendationPrivacyString(', numberOfRecommendations '))
        .addCommand(getBlogRecommendationPrivacyString())
        .optionalMatch("(user)-[:RECOMMENDS]->(userRec:Recommendation)-[:RECOMMENDS]->(pinwallData)")
        .return(`user, pinwall, pinwallData, contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact, numberOfRecommendations, writer,
            userRec.recommendationId AS userRecommendationId,
            EXISTS((user)-[:RECOMMENDS]->(pinwall)) AS thisRecommendationByUser,
            SIZE((pinwallData)<-[:RECOMMENDS]-(:Recommendation)) AS totalNumberOfRecommendations`)
        .end({
            userId: userId, skip: request.skipRecommendation, maxItems: request.maxItems, language: request.language, topic: request.topic,
            recommendationType: request.recommendationType
        });
};

let sortPinwall = function (resp, skipRecommendation, skipBlog, maxItems, order, showUserRecommendation, request) {
    let pinwall;
    if (showUserRecommendation && order === 'popular') {
        pinwall = pinwallSelector.sortPinwall(null, resp[5], skipRecommendation, skipBlog, maxItems);
    } else if (showUserRecommendation) {
        pinwall = pinwallSelector.sortPinwall(resp[5], resp[6], skipRecommendation, skipBlog, maxItems);
    } else if (!showUserRecommendation && order === 'popular') {
        pinwall = pinwallSelector.sortPinwall(null, resp[2], skipRecommendation, skipBlog, maxItems);
    } else if (!showUserRecommendation) {
        pinwall = pinwallSelector.sortPinwall(resp[2], resp[3], skipRecommendation, skipBlog, maxItems);
    } else {
        logger.error(`Error sorting pinwall (Order:${order}, showUserRecommendation: ${showUserRecommendation})`, request);
    }
    return pinwall;
};


let getPinwall = function (userId, request) {
    let commands = [];

    return recommendedUserSetting.showUserRecommendationOnHome(userId).then(function (showUserRecommendation) {
        commands.push(contacting.getContacting(userId).getCommand());
        commands.push(contacting.getNumberOfContacting(userId).getCommand());
        if (showUserRecommendation) {
            commands.push(recommendedUser.getInvitedUsers(userId, 10).getCommand());
            commands.push(recommendedUser.getRecommendedByContactUsers(userId, 10).getCommand());
            commands.push(recommendedUser.getRecommendedUsers(userId, 10).getCommand());
        }
        if (request.order !== 'popular') {
            commands.push(getBlogs(userId, request).getCommand());
        }

        return getRecommendations(userId, request)
            .send(commands)
            .then(function (resp) {
                let pinwall, recommendedUserResult = [];
                userInfo.addImageForThumbnail(resp[0]);
                if (showUserRecommendation) {
                    userInfo.addImageForThumbnail(resp[2]);
                    userInfo.addImageForThumbnail(resp[3]);
                    userInfo.addImageForThumbnail(resp[4]);
                    recommendedUserResult = resp[2].concat(resp[3], resp[4]);
                }
                pinwall = sortPinwall(resp, request.skipRecommendation, request.skipBlog, request.maxItems, request.order, showUserRecommendation);

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
    getRecommendationOfUser: getRecommendationOfUser,
    getRecommendationOfOtherUser: getRecommendationOfOtherUser,
    getPagesOfUser: getPagesOfUser,
    getPagesOfOtherUser: getPagesOfOtherUser
};
