'use strict';

var db = require('./../../neo4j');
var underscore = require('underscore');
var pagePreview = require('./pagePreview');

var searchPages = function (userId, search, skip, limit) {

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

    startQuery.match("(page:Page)<-[:IS_ADMIN]-(user:User {userId: {userId}})")
        .where("page.title =~ {search} ")
        .with("page, user")
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(user)")
        .with("page, user, count(rec) AS numberOfRecommendations, rec");

    commands.push(db.cypher().addCommand(startQuery.getCommandString())
        .return("count(*) AS totalNumberOfPages").end(params).getCommand());

    return startQuery
        .return("page.pageId AS pageId, page.title AS title, page.label AS label, page.language AS language, " +
        "page.link AS link, numberOfRecommendations, rec.comment AS comment, user.name AS name, user.userId AS userId, " +
        "true AS isAdmin")
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

var searchSuggestionModePages = function (userId, search, skip, limit) {

    var searchRegEx = '(?i).*'.concat(search, '.*');

    return db.cypher().match("(page:Page)<-[:IS_ADMIN]-(user:User {userId: {userId}})")
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
    searchPages: searchPages,
    searchSuggestionModePages: searchSuggestionModePages
};
