'use strict';

let db = requireDb();
let pagePreview = require('./pagePreview');
let underscore = require('underscore');

let getTotalAdministratedPages = function (userId) {
    return db.cypher().match("(page)<-[:IS_ADMIN]-(user:User {userId: {userId}})")
        .return("count(*) AS totalNumberOfPages").end({userId: userId}).getCommand();
};

let getAdministratedUserPages = function (userId, skip, limit) {

    let commands = [];

    commands.push(getTotalAdministratedPages(userId));

    return db.cypher().match("(page:Page)<-[:IS_ADMIN]-(user:User {userId: {userId}})")
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(user)")
        .return("page.pageId AS pageId, page.title AS title, page.label AS label, page.language AS language, " +
        "page.link AS link, rec.comment AS comment, user.name AS name, user.userId AS userId, " +
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
