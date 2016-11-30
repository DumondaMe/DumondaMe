'use strict';

var db = requireDb();
var underscore = require('underscore');
var pagePreview = require('./pagePreview');
var pageFilter = require('./pageFilter');

var searchPageQuery = function (userId, filterType) {
    var filterQuery = pageFilter.getFilterQuery(filterType);

    return db.cypher().match("(page:Page), (user:User {userId: {userId}})")
        .where("(" + filterQuery + ") AND (page.title =~ {search} OR page.link =~ {search})")
        .with("page, user")
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)")
        .with("page, count(rec) AS numberOfRecommendations, user")
        .optionalMatch("(page)<-[:WRITTEN]-(writer:User)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(writer)-[privacyRel:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = privacyRel.type")
        .optionalMatch("(writer)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("privacy is null");
};

var fullSearchPageQuery = function (userId, search, filterType, skip, limit) {
    var searchRegEx = '(?i).*'.concat(search, '.*');
    
    return searchPageQuery(userId, filterType)
        .return(`page.pageId AS pageId, page.title AS title, page.text AS text, page.label AS label, page.linkEmbed AS linkEmbed, page.link AS link,
                 numberOfRecommendations, page.topic AS topic, page.heightPreviewImage AS heightPreviewImage, privacy.profile AS profileVisible, 
                 privacy.image AS imageVisible, privacyNoContact.profile AS profileVisibleNoContact, privacyNoContact.image AS imageVisibleNoContact, 
                 writer.userId as userId, writer.name AS writerName,
                 EXISTS((page)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin,
                 EXISTS((page)<-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(:User {userId: {userId}})) AS userRecommended` )
        .orderBy("userRecommended DESC, page.title")
        .skip("{skip}")
        .limit("{limit}").end({
            userId: userId,
            skip: skip,
            limit: limit,
            search: searchRegEx
        });
};

var searchPage = function (userId, search, filterType, skip, limit) {

    var orderBy = "page.modified DESC", 
        startQuery = searchPageQuery(userId, filterType),
        searchRegEx = '(?i).*'.concat(search.replace(/\?/, "\\?"), '.*');

    return pagePreview.pagePreviewQuery({
        userId: userId,
        skip: skip,
        limit: limit,
        search: searchRegEx
    }, orderBy, startQuery);
};

var searchUserRecommendedPage = function (userId, search, skip, limit) {

    var orderBy = "page.title, page.modified DESC",
        startQuery = db.cypher(),
        searchRegEx = '(?i).*'.concat(search, '.*'),
        commands = [],
        params = {
            userId: userId,
            skip: skip,
            limit: limit,
            search: searchRegEx
        };

    startQuery.match("(page:Page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(user:User {userId: {userId}})")
        .where("page.title =~ {search} ")
        .with("page, user, count(rec) AS numberOfRecommendations, rec");

    commands.push(db.cypher().addCommand(startQuery.getCommandString())
        .return("count(*) AS totalNumberOfPages").end(params).getCommand());

    return startQuery
        .return("page.pageId AS pageId, page.title AS title, LABELS(page) AS types, page.language AS language, page.label AS label, " +
        "page.link AS link, numberOfRecommendations, rec.comment AS comment, user.name AS name, user.userId AS userId, " +
        "EXISTS((page)<-[:IS_ADMIN]-(user)) AS isAdmin")
        .orderBy(orderBy)
        .skip("{skip}")
        .limit("{limit}")
        .end(params)
        .send(commands)
        .then(function (resp) {
            underscore.forEach(resp[1], function (page) {
                page.imageVisible = true;
                page.profileVisible = true;
            });
            pagePreview.addContactRecommendation(resp[1]);
            pagePreview.addPageUrl(resp[1]);
            return {pages: resp[1], totalNumberOfPages: resp[0][0].totalNumberOfPages};
        });
};

var searchSuggestionUserRecommendedPage = function (userId, search, skip, limit) {

    var searchRegEx = '(?i).*'.concat(search, '.*');

    return db.cypher().match("(page:Page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(user:User {userId: {userId}})")
        .where("page.title =~ {search} ")
        .return("DISTINCT page.title AS name")
        .orderBy("page.title")
        .skip("{skip}")
        .limit("{limit}")
        .end({
            userId: userId,
            skip: skip,
            limit: limit,
            search: searchRegEx
        })
        .send();
};

module.exports = {
    searchPage: searchPage,
    searchPageQuery: fullSearchPageQuery,
    searchUserRecommendedPage: searchUserRecommendedPage,
    searchSuggestionUserRecommendedPage: searchSuggestionUserRecommendedPage
};
