'use strict';

var db = require('./../../neo4j');
var pagePreview = require('./pagePreview');
var pageFilter = require('./pageFilter');

var getTotalRecommendationContacts = function (userId, filterQuery) {
    return db.cypher().match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .where("(" + filterQuery + ")")
        .with("page, max(contactRec.created) AS created")
        .match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(contact:User)<-[:IS_CONTACT]-(user:User {userId: {userId}})")
        .where("contactRec.created = created")
        .return("count(*) AS totalNumberOfPages").end({userId: userId}).getCommand();
};

var getTotalRecommendationUser = function (userId, filterQuery) {
    return db.cypher().match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User {userId: {userId}})")
        .where("(" + filterQuery + ")")
        .return("count(*) AS totalNumberOfPages").end({userId: userId}).getCommand();
};

var getRecommendationOtherUser = function (userId, otherUserId, skip, limit, filters) {

    var filterQuery = pageFilter.getFilterQuery(filters),
        commands = [];

    commands.push(getTotalRecommendationUser(otherUserId, filterQuery));

    return db.cypher().match("(page:Page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(otherUser:User {userId: {otherUserId}}), " +
        "(user:User {userId: {userId}})")
        .where("(" + filterQuery + ")")
        .with("page, contactRec, otherUser, user")
        .match("(otherUser)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(otherUser)")
        .with("page, contactRec, otherUser, user, rContact, privacy, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("page.pageId AS pageId, page.title AS title, page.label AS label, page.language AS language, " +
        "page.link AS link, contactRec.comment AS comment, otherUser.userId AS userId, otherUser.name AS name, " +
        "privacy.profile AS profileVisible, privacy.image AS imageVisible, EXISTS((page)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin")
        .orderBy("contactRec.created DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end({
            userId: userId,
            otherUserId: otherUserId,
            skip: skip,
            limit: limit
        })
        .send(commands)
        .then(function (resp) {
            pagePreview.addContactRecommendation(resp[1]);
            pagePreview.addPageUrl(resp[1]);
            return {pages: resp[1], totalNumberOfPages: resp[0][0].totalNumberOfPages};
        });
};

var getRecommendationUser = function (userId, skip, limit) {

    var commands = [];

    commands.push(getTotalRecommendationUser(userId, pageFilter.getFilterQuery()));

    return db.cypher().match("(page:Page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(user:User {userId: {userId}})")
        .return("page.pageId AS pageId, page.title AS title, page.label AS label, page.language AS language, " +
        "page.link AS link, contactRec.comment AS comment, user.userId AS userId, user.name AS name, " +
        "true AS profileVisible, true AS imageVisible, EXISTS((page)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin")
        .orderBy("contactRec.created DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end({
            userId: userId,
            skip: skip,
            limit: limit
        })
        .send(commands)
        .then(function (resp) {
            pagePreview.addContactRecommendation(resp[1]);
            pagePreview.addPageUrl(resp[1]);
            return {pages: resp[1], totalNumberOfPages: resp[0][0].totalNumberOfPages};
        });
};

var getRecommendationContacts = function (userId, skip, limit, filters) {

    var orderBy = "contactRec.created DESC",
        filterQuery = pageFilter.getFilterQuery(filters),
        commands = [];

    commands.push(getTotalRecommendationContacts(userId, filterQuery));

    return db.cypher().match("(page:Page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .where("(" + filterQuery + ")")
        .with("page, max(contactRec.created) AS created")
        .match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(contact:User)<-[:IS_CONTACT]-(user:User {userId: {userId}})")
        .where("contactRec.created = created")
        .with("page, contactRec, contact, user")
        .match("(contact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("page, contactRec, contact, rContact, privacy, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("page.pageId AS pageId, page.title AS title, page.label AS label, page.language AS language, " +
        "page.link AS link, contactRec.comment AS comment, contact.name AS name, contact.userId AS userId, " +
        "privacy.profile AS profileVisible, privacy.image AS imageVisible, EXISTS((page)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin")
        .orderBy(orderBy)
        .skip("{skip}")
        .limit("{limit}")
        .end({
            userId: userId,
            skip: skip,
            limit: limit
        })
        .send(commands)
        .then(function (resp) {
            pagePreview.addContactRecommendation(resp[1]);
            pagePreview.addPageUrl(resp[1]);
            return {pages: resp[1], totalNumberOfPages: resp[0][0].totalNumberOfPages};
        });
};

module.exports = {
    getRecommendationContacts: getRecommendationContacts,
    getRecommendationOtherUser: getRecommendationOtherUser,
    getRecommendationUser: getRecommendationUser
};
