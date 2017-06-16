'use strict';

let db = requireDb();
let userInfo = require('./../userInfo');
let pinwallFilter = require('./pinwallFilter');
let pinwallElement = require('./pinwallElement/pinwallElement');
let pinwallSelector = require('./pinwallSelector');
let contacting = require('./contacting');
let recommendedUser = require('./recommendedUser');
let recommendedUserSetting = require('./../setting/recommendedUser');
let suggestPage = require('./suggestPage');

let getRecommendationOfUser = function (userId, request) {
    return db.cypher().match("(user:User {userId: {userId}})-[:RECOMMENDS]->(userRec:Recommendation)-[:RECOMMENDS]->(page)")
        .optionalMatch("(page)<-[:WRITTEN]-(writer:User)")
        .return(`user, userRec, page, LABELS(page) AS pinwallType, true AS recommendedByUser,
                 userRec.recommendationId AS userRecommendationId, NOT EXISTS(userRec.visible) AS isPublic,
                 EXISTS((user)-[:IS_ADMIN]->(page)) AS isAdmin, userRec.created AS created,
                 SIZE((page)<-[:RECOMMENDS]-(:Recommendation)) AS totalNumberOfRecommendations`)
        .orderBy("userRec.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({userId: userId, skip: request.skip, maxItems: request.maxItems})
        .send()
        .then(function (resp) {
            return {pinwall: pinwallElement.getPinwallElements(resp)};
        });
};

let getPagesOfUserOrder = function (type) {
    if (type === 'adminPopular') {
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
                              (otherUser:User {userId: {detailUserId}})-[:RECOMMENDS]->(otherUserRec:Recommendation)-[:RECOMMENDS]->(page)`)
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(otherUser)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .with(`user, otherUserRec, page, otherUser, isContact, privacy, privacyNoContact`)
        .where(`((NOT EXISTS(page.visible) AND ANY(l IN LABELS(page) WHERE l = 'Blog'))
                 OR (ANY(v IN page.visible WHERE v = isContact.type) AND ANY(l IN LABELS(otherUserRec) WHERE l = 'Blog'))
                 OR (NONE(l IN LABELS(page) WHERE l = 'Blog'))) AND
                (privacy.pinwall = true OR (NOT (otherUser)-[:IS_CONTACT]->(user) AND privacyNoContact.pinwall = true)) AND
                (privacy.profile = true OR (NOT (otherUser)-[:IS_CONTACT]->(user) AND privacyNoContact.profile = true))
                 AND NOT (otherUser)-[:IS_BLOCKED]->(user)`)
        .optionalMatch("(user)-[:RECOMMENDS]->(userRec:Recommendation)-[:RECOMMENDS]->(page)")
        .optionalMatch("(writer)-[:WRITTEN]->(page)")
        .return(`user, page, otherUser AS contact, LABELS(page) AS pinwallType, privacy, privacyNoContact, otherUserRec.created AS created,
                 NOT EXISTS(page.visible) AS isPublic, userRec.recommendationId AS userRecommendationId, writer,
                 SIZE((page)<-[:RECOMMENDS]-(:Recommendation)) AS totalNumberOfRecommendations`)
        .orderBy("otherUserRec.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({userId: userId, detailUserId: request.userId, skip: request.skip, maxItems: request.maxItems})
        .send()
        .then(function (resp) {
            return {pinwall: pinwallElement.getPinwallElements(resp)};
        });
};

let getPagesOfOtherUserOrder = function (type) {
    if (type === 'adminPopular') {
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
        return db.cypher().match(`(user:User {userId: {userId}}), (writer:User)-[:WRITTEN]->(page:Blog)`)
            .where(`EXISTS((user)-[:IS_CONTACT]->(:User)-[:WRITTEN]->(page)) OR 
                    EXISTS((user)-[:IS_CONTACT]->(:User)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(page)) OR 
                    EXISTS((user)-[:WRITTEN]->(page))`)
            .with(`user, writer, page`);
    }
    return db.cypher().match(`(user:User {userId: {userId}}), (writer:User)-[:WRITTEN]->(page:Blog)`);
};

let getOrderFilter = function (order, contactOnly, createdElementName) {
    if (order === 'popular') {
        if(contactOnly) {
            return `numberOfContactRecommendations DESC, ${createdElementName}.created DESC`;
        } else {
            return `totalNumberOfRecommendations DESC, ${createdElementName}.created DESC`;
        }
    }
    return `${createdElementName}.created DESC`;
};

let getPopularOnlyContactFilter = function (order, contactOnly) {
    if (order === 'popular' && contactOnly) {
        return `numberOfContactRecommendations > 0`;
    }
    return `true`;
};

let getBlogs = function (userId, request) {
    let filters = pinwallFilter.getFilters(request, 'page', true, 'writer');
    return getBlogOnlyContactFilter(request.onlyContact)
        .where(filters)
        .optionalMatch("(user)-[hasContact:IS_CONTACT]->(writer)-[:WRITTEN]->(page)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(writer)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .optionalMatch("(writer)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("privacy is NULL")
        .optionalMatch("(page)<-[:RECOMMENDS]-(recommendation:Recommendation)")
        .with(`user, writer, page, isContact, hasContact, privacy, privacyNoContact, count(recommendation) AS totalNumberOfRecommendations, 
               EXISTS((user)-[:WRITTEN]->(page)) AS isAdmin`)
        .where(`((user)-[:WRITTEN]->(page) OR (writer IS NOT null AND NOT EXISTS(page.visible)) OR 
                (writer IS NOT null AND ANY(v IN page.visible WHERE v = isContact.type))) AND
                ((user)-[:WRITTEN]->(page) OR privacy.pinwall = true OR 
                (NOT (writer)-[:IS_CONTACT]->(user) AND privacyNoContact.pinwall = true)) AND
                ((user)-[:WRITTEN]->(page) OR privacy.profile = true OR 
                (NOT (writer)-[:IS_CONTACT]->(user) AND privacyNoContact.profile = true)) AND
                NOT (writer)-[:IS_BLOCKED]->(user)`)
        .with(`user, writer, page, isContact, hasContact, privacy, privacyNoContact, totalNumberOfRecommendations, isAdmin,
               SIZE((page)<-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(user)) 
               AS numberOfContactRecommendations`)
        .where(getPopularOnlyContactFilter(request.order, request.onlyContact))
        .optionalMatch("(user)-[:RECOMMENDS]->(userRec:Recommendation)-[:RECOMMENDS]->(page)")
        .return(`user, page, writer, LABELS(page) AS pinwallType, privacy, privacyNoContact, isAdmin, 
                 NOT EXISTS(page.visible) AS isPublic, userRec.recommendationId AS userRecommendationId, page.created AS created,
                 EXISTS((user)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(page)) AS recommendedByUser,
                 numberOfContactRecommendations, totalNumberOfRecommendations`)
        .orderBy(getOrderFilter(request.order, request.onlyContact, 'page'))
        .skip("{skip}")
        .limit("{maxItems}")
        .end({
            userId: userId, skip: request.skipBlog, maxItems: request.maxItems, language: request.language, topic: request.topic,
            pageType: request.pageType
        });
};

let getPagePrivacyString = function () {
    return db.cypher().optionalMatch("(user)-[hasContact:IS_CONTACT]->(admin)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(admin)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .optionalMatch("(admin)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("isContact is NULL")
        .with("user, admin, page, isContact, hasContact, privacy, privacyNoContact")
        .where(`NOT (admin)-[:IS_BLOCKED]->(user)`)
        .getCommandString();
};

let getNewestPageFilter = function (onlyContact) {
    if (onlyContact) {
        return db.cypher().match(`(user:User {userId: {userId}}), (admin:User)-[:IS_ADMIN]->(page:Page)`)
            .where(`(EXISTS((user)-[:IS_CONTACT]->(:User)-[:IS_ADMIN]->(page)) OR 
                    EXISTS((user)-[:IS_CONTACT]->(:User)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(page)) OR 
                    EXISTS((user)-[:IS_ADMIN]->(page)))`)
            .with(`user, admin, page`);
    }
    return db.cypher().match(`(user:User {userId: {userId}}), (admin:User)-[:IS_ADMIN]->(page:Page)`);
};

let sortPinwall = function (resp, skipRecommendation, skipBlog, maxItems, order, showUserRecommendation, onlyContact) {
    let pinwall;
    if (showUserRecommendation) {
        pinwall = pinwallSelector.sortPinwall(resp[5], resp[6], skipRecommendation, skipBlog, maxItems, order, onlyContact);
    } else {
        pinwall = pinwallSelector.sortPinwall(resp[2], resp[3], skipRecommendation, skipBlog, maxItems, order, onlyContact);
    }
    return pinwall;
};

let getPages = function (userId, request, commands, showUserRecommendation) {
    let filters = pinwallFilter.getFilters(request, 'page');
    return getNewestPageFilter(request.onlyContact)
        .where(`${filters} AND NONE (label IN LABELS(page) WHERE label = 'Blog')`)
        .addCommand(getPagePrivacyString())
        .with(`user, admin, page, privacy, privacyNoContact, 
               SIZE((page)<-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(user)) 
               AS numberOfContactRecommendations`)
        .where(getPopularOnlyContactFilter(request.order, request.onlyContact))
        .optionalMatch("(user)-[:RECOMMENDS]->(userRec:Recommendation)-[:RECOMMENDS]->(page)")
        .return(`user, admin, page, LABELS(page) AS pinwallType, privacy, privacyNoContact,
            userRec.recommendationId AS userRecommendationId, page.created AS created,
            EXISTS((user)-[:IS_ADMIN]->(page)) AS isAdmin,
            SIZE((page)<-[:RECOMMENDS]-(:Recommendation)) AS totalNumberOfRecommendations,
            numberOfContactRecommendations`)
        .orderBy(getOrderFilter(request.order, request.onlyContact, 'page'))
        .skip("{skip}")
        .limit("{maxItems}")
        .end({
            userId: userId, skip: request.skipRecommendation, maxItems: request.maxItems, language: request.language, topic: request.topic,
            pageType: request.pageType
        }).send(commands).then(function (resp) {
            let pinwall, recommendedUserResult = [];
            userInfo.addImageForThumbnail(resp[0]);
            if (showUserRecommendation) {
                userInfo.addImageForThumbnail(resp[2]);
                userInfo.addImageForThumbnail(resp[3]);
                userInfo.addImageForThumbnail(resp[4]);
                recommendedUserResult = resp[2].concat(resp[3], resp[4]);
            }
            pinwall = sortPinwall(resp, request.skipRecommendation, request.skipBlog, request.maxItems, request.order,
                showUserRecommendation, request.onlyContact);

            return {
                contacting: {users: resp[0], numberOfContacting: resp[1][0].numberOfContacting},
                recommendedUser: recommendedUserResult,
                pinwall: pinwallElement.getPinwallElements(pinwall.pinwall),
                skipRecommendation: pinwall.skipRecommendation,
                skipBlog: pinwall.skipBlog
            };
        });
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

        if (request.order === 'suggestPage') {
            return suggestPage.getRecommendations(userId, request, commands, showUserRecommendation);
        } else {
            commands.push(getBlogs(userId, request).getCommand());
            return getPages(userId, request, commands, showUserRecommendation);
        }
    });
};

module.exports = {
    getPinwall: getPinwall,
    getRecommendationOfUser: getRecommendationOfUser,
    getRecommendationOfOtherUser: getRecommendationOfOtherUser,
    getPagesOfUser: getPagesOfUser,
    getPagesOfOtherUser: getPagesOfOtherUser
};
