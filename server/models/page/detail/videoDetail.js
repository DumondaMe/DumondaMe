'use strict';

var db = require('./../../../neo4j');
var userInfo = require('../../user/userInfo');
var administrator = require('./administrator');
var recommendation = require('./recommendation');
var response = require('./detailResponse');
var logger = requireLogger.getLogger(__filename);

var getYoutubeResponse = function (resp) {
    var returnPage = {};
    returnPage.title = resp.title;
    returnPage.description = resp.description;
    returnPage.language = resp.language;
    returnPage.link = resp.link;
    returnPage.subCategory = resp.subCategory;
    returnPage.created = resp.created;
    returnPage.modified = resp.modified;
    return returnPage;
};

var getVideoDetail = function (pageId, userId) {

    var commands = [];

    commands.push(administrator.getAdministrator(pageId, ':VideoPage', userId));
    commands.push(recommendation.getUserRecommendation(pageId, ':VideoPage', userId));
    commands.push(recommendation.getRecommendationSummaryAll(pageId, ':VideoPage').getCommand());
    commands.push(recommendation.getRecommendationSummaryContacts(pageId, ':VideoPage', userId).getCommand());

    return db.cypher().match("(page:VideoPage {pageId: {pageId}})")
        .return("page")
        .end({pageId: pageId})
        .send(commands)
        .then(function (resp) {
            var pageResponse;
            if(resp[4][0].page.subCategory === 'Youtube') {
                pageResponse = getYoutubeResponse(resp[4][0].page);
            }
            return response.getResponse(resp, pageResponse, pageId, userId);
        });
};

module.exports = {
    getVideoDetail: getVideoDetail
};
