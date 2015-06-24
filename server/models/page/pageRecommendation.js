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

var getTotalRecommendationOtherUser = function (otherUserId, filterQuery) {
    return db.cypher().match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User {userId: {otherUserId}})")
        .where("(" + filterQuery + ")")
        .return("count(*) AS totalNumberOfPages").end({otherUserId: otherUserId}).getCommand();
};

var getRecommendationOtherUser = function (userId, otherUserId, skip, limit, filters) {

    var orderBy = "contactRec.rating DESC, contactRec.created DESC",
        filterQuery = pageFilter.getFilterQuery(filters),
        commands = [];

    commands.push(getTotalRecommendationOtherUser(otherUserId, filterQuery));

    return db.cypher().match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(otherUser:User {userId: {otherUserId}}), " +
        "(user:User {userId: {userId}})")
        .where("(" + filterQuery + ")")
        .with("page, contactRec, otherUser, user")
        .match("(otherUser)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(otherUser)")
        .with("page, contactRec, otherUser, user, rContact, privacy, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("page.pageId AS pageId, page.title AS title, LABELS(page) AS types, page.language AS language, page.subCategory AS subCategory, " +
        "page.link AS link, contactRec.rating AS rating, contactRec.comment AS comment, otherUser.userId AS userId, otherUser.name AS name, " +
        "privacy.profile AS profileVisible, privacy.image AS imageVisible, EXISTS((page)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin")
        .orderBy(orderBy)
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
            pagePreview.addLabel(resp[1]);
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

    return db.cypher().match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .where("(" + filterQuery + ")")
        .with("page, max(contactRec.created) AS created")
        .match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(contact:User)<-[:IS_CONTACT]-(user:User {userId: {userId}})")
        .where("contactRec.created = created")
        .with("page, contactRec, contact, user")
        .match("(contact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("page, contactRec, contact, rContact, privacy, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("page.pageId AS pageId, page.title AS title, LABELS(page) AS types, page.language AS language, page.subCategory AS subCategory, " +
        "page.link AS link, contactRec.rating AS rating, contactRec.comment AS comment, contact.name AS name, contact.userId AS userId, " +
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
            pagePreview.addLabel(resp[1]);
            pagePreview.addContactRecommendation(resp[1]);
            pagePreview.addPageUrl(resp[1]);
            return {pages: resp[1], totalNumberOfPages: resp[0][0].totalNumberOfPages};
        });
};

var getPopularPages = function (userId, skip, limit, onlyContact, pageType, subCategory) {

    var orderBy = "rating DESC, numberOfRatings DESC",
        startQuery = db.cypher(), matchQuery, subCategoryWhere = '';

    if (onlyContact) {
        matchQuery = "(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})";
    } else {
        matchQuery = "(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User)";
    }

    if (subCategory) {
        subCategoryWhere = ' AND page.subCategory = {subCategory}';
    }

    startQuery.match(matchQuery)
        .where("page:" + pageType + subCategoryWhere)
        .with("page, AVG(contactRec.rating) AS rating, COUNT(contactRec) AS numberOfRatings");

    return pagePreview.pagePreviewQuery({
        userId: userId,
        skip: skip,
        limit: limit,
        subCategory: subCategory
    }, orderBy, startQuery);
};

module.exports = {
    getRecommendationContacts: getRecommendationContacts,
    getRecommendationOtherUser: getRecommendationOtherUser,
    getPopularPages: getPopularPages
};
