'use strict';

var db = require('./../../neo4j');
var pagePreview = require('./pagePreview');
var pageFilter = require('./pageFilter');
var underscore = require('underscore');

var getTotalAdministratedPages = function (userId, filterQuery) {
    return db.cypher().match("(page)<-[:IS_ADMIN]-(user:User {userId: {userId}})")
        .where("(" + filterQuery + ")")
        .return("count(*) AS totalNumberOfPages").end({userId: userId}).getCommand();
};

var getAdministratedUserPages = function (userId, skip, limit, filters) {

    var filterQuery = pageFilter.getFilterQuery(filters),
        commands = [];

    commands.push(getTotalAdministratedPages(userId, filterQuery));

    return db.cypher().match("(page)<-[:IS_ADMIN]-(user:User {userId: {userId}})")
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(user)")
        .where("(" + filterQuery + ")")
        .return("page.pageId AS pageId, page.title AS title, LABELS(page) AS types, page.language AS language, page.subCategory AS subCategory, " +
        "page.link AS link, rec.rating AS rating, rec.comment AS comment, user.name AS name, user.userId AS userId, " +
        "true AS isAdmin")
        .orderBy("page.modified DESC")
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
            underscore.forEach(resp[1], function (page) {
                page.imageVisible = true;
                page.profileVisible = true;
            });
            pagePreview.addContactRecommendation(resp[1]);
            pagePreview.addPageUrl(resp[1]);
            return {pages: resp[1], totalNumberOfPages: resp[0][0].totalNumberOfPages};
        });
};

module.exports = {
    getAdministratedUserPages: getAdministratedUserPages
};
