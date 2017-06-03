'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let userInfo = require('./../userInfo');
let pagePreview = require('../../page/pagePreview');
let pinwallFilter = require('./pinwallFilter');

let parseResult = function (showUserRecommendation, skip, firstQuery, secondQuery = []) {
    let pinwall, recommendedUserResult = [];
    userInfo.addImageForThumbnail(firstQuery[0]);
    if (showUserRecommendation) {
        userInfo.addImageForThumbnail(firstQuery[2]);
        userInfo.addImageForThumbnail(firstQuery[3]);
        userInfo.addImageForThumbnail(firstQuery[4]);
        recommendedUserResult = firstQuery[2].concat(firstQuery[3], firstQuery[4]);
        pinwall = firstQuery[6].concat(secondQuery);
    } else {
        pinwall = firstQuery[3].concat(secondQuery);
    }

    pagePreview.addPageUrl(pinwall);

    return {
        contacting: {users: firstQuery[0], numberOfContacting: firstQuery[1][0].numberOfContacting},
        recommendedUser: recommendedUserResult,
        pinwall: pinwall,
        skipRecommendation: skip + pinwall.length,
        skipBlog: 0
    };
};

let getMostPopularPagesPreviousMonthQuery = function (userId, skip, maxItems) {
    return db.cypher().match(`(suggestedPage:Page)<-[:RECOMMENDS]-(recommendation:Recommendation)<-[:RECOMMENDS]-(user:User)`)
        .where(`NOT (suggestedPage)<-[:IS_ADMIN]-(:User {userId: {userId}}) AND user.userId <> {userId} AND
                recommendation.created > {oneMonth}`)
        .with(`suggestedPage, COUNT(suggestedPage) AS countSuggestedPage`)
        .where(`NOT (:User {userId: {userId}})-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(:Page)
                <-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(:User)
                -[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(suggestedPage)`)
        .return(`suggestedPage.pageId AS pageId, suggestedPage.title AS title, suggestedPage.description AS description, 
                 suggestedPage.label AS label, suggestedPage.link AS link, 
                 suggestedPage.topic AS topic, suggestedPage.hostname AS hostname, suggestedPage.text AS text, 
                 suggestedPage.heightPreviewImage AS heightPreviewImage, suggestedPage.linkEmbed AS linkEmbed,
                 false AS recommendedByUser, false AS thisRecommendationByUser, 'Recommendation' AS pinwallType,
                 EXISTS((suggestedPage)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin,
                 SIZE((:User)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(suggestedPage)) AS totalNumberOfRecommendations`)
        .orderBy("countSuggestedPage DESC")
        .skip("{skip}")
        .limit("{maxItems}").end({
            userId: userId,
            skip: skip,
            maxItems: maxItems,
            oneMonth: time.getNowUtcTimestamp() - 2419200
        }).send();
};

let getSimilarPagesComparedOtherUsersQuery = function () {
    return db.cypher()
        .match(`(user:User {userId: {userId}})-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(:Page)
                 <-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(otherUser:User)`)
        .where(`otherUser.userId <> {userId}`)
        .with(`otherUser, COUNT(otherUser) AS numberOfSameRecommendation, EXISTS((user)-[:IS_CONTACT]->(otherUser)) AS isContact`)
        .orderBy(`isContact DESC, numberOfSameRecommendation DESC`)
        .match(`(otherUser)-[:RECOMMENDS]->(recommendation:Recommendation)-[:RECOMMENDS]->(suggestedPage:Page)`)
        .where(`NOT (suggestedPage)<-[:IS_ADMIN]-(:User {userId: {userId}}) AND NOT 
               (:User {userId: {userId}})-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(suggestedPage)`);
};

let getSkipMostPopularPage = function (skip, totalNumberOfPages, previsouSkipLength) {
    let result = skip - totalNumberOfPages - previsouSkipLength;
    if (result < 0) {
        result = 0;
    }
    return result;
};

let getRecommendations = function (userId, request, commands, showUserRecommendation) {

    let paramsCypher = {
        userId: userId,
        skip: request.skipRecommendation,
        maxItems: request.maxItems
    };
    commands.push(getSimilarPagesComparedOtherUsersQuery()
        .return(`COUNT(DISTINCT suggestedPage.pageId) AS totalNumberOfPages`).end(paramsCypher).getCommand());

    return getSimilarPagesComparedOtherUsersQuery()
        .return(`count(suggestedPage) AS numberOfSuggestedPages, suggestedPage.pageId AS pageId, suggestedPage.title AS title, 
                 suggestedPage.description AS description, suggestedPage.label AS label, suggestedPage.link AS link, 
                 suggestedPage.topic AS topic, suggestedPage.hostname AS hostname, suggestedPage.text AS text, 
                 suggestedPage.heightPreviewImage AS heightPreviewImage, suggestedPage.linkEmbed AS linkEmbed, 
                 EXISTS((suggestedPage)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin, isContact, 
                 max(recommendation.created) AS recommendationCreated, max(numberOfSameRecommendation) AS numberOfSameRecommendation,
                 false AS recommendedByUser, false AS thisRecommendationByUser, 'Recommendation' AS pinwallType,
                 SIZE((:User)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(suggestedPage)) AS totalNumberOfRecommendations`)
        .orderBy("isContact DESC, numberOfSameRecommendation DESC, recommendationCreated DESC, totalNumberOfRecommendations DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end(paramsCypher).send(commands).then(function (resp) {
            if (resp[1].length < paramsCypher.maxItems) {
                let skip = getSkipMostPopularPage(paramsCypher.skip, resp[5][0].totalNumberOfPages, resp[6].length),
                    maxItems = paramsCypher.maxItems - resp[1].length;
                return getMostPopularPagesPreviousMonthQuery(userId, skip, maxItems).then(function (respPopular) {
                    return parseResult(showUserRecommendation, skip, resp, respPopular);
                });
            } else {
                return parseResult(showUserRecommendation, request.skipRecommendation, resp);
            }
        });
};


module.exports = {
    getRecommendations: getRecommendations
};
