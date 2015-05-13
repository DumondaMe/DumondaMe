'use strict';

var db = require('./../../../neo4j');
var administrator = require('./administrator');
var detailTitlePicture = require('./detailTitlePicture');
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);

var getVideoActors = function (pageId, userId) {

    return db.cypher().match("(:VideoPage {pageId: {pageId}})<-[:IS_ACTOR]-(u:User)")
        .return("u.name AS name, u.userId AS userId, u.userId = {userId} AS isLoggedInUser")
        .end({pageId: pageId, userId: userId})
        .getCommand();
};

var addActors = function (videoPage, actorLinks) {
    var authors = [];
    if (videoPage.actor) {
        authors.push({name: videoPage.actor, isLoggedInUser: false});
        delete videoPage.actor;
    }
    if (actorLinks && actorLinks.length > 0) {
        authors = authors.concat(actorLinks);
    }

    videoPage.actor = authors;
};

var getVideoDetail = function (pageId, userId) {

    var commands = [];

    commands.push(administrator.getAdministrator(pageId, ':VideoPage', userId));
    commands.push(getVideoActors(pageId, userId));

    return db.cypher().match("(page:VideoPage {pageId: {pageId}})")
        .return("page.title AS title, page.description AS description, page.created AS created, page.actor AS actor, page.link AS link, " +
        "page.duration AS duration")
        .end({pageId: pageId})
        .send(commands)
        .then(function (resp) {
            addActors(resp[2][0], resp[1]);
            detailTitlePicture.addTitlePicture(pageId, resp[2][0], 'VideoPage');
            return {page: resp[2][0], administrators: {list: resp[0]}};
        });
};

module.exports = {
    getVideoDetail: getVideoDetail
};
