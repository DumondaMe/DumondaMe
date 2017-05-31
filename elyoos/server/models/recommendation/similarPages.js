'use strict';

let db = requireDb();
let pagePreview = require('../page/pagePreview');
let _ = require('lodash');

let parseResult = function (queryResult, queryResult2 = []) {
    let combined = _.concat(queryResult, queryResult2);
    pagePreview.addRecommendation(combined);
    pagePreview.addPageUrl(combined);
    return {pages: combined};
};

/**
 * Search for the most popular pages which have no recommendation connection to the basis page.
 * @param userId
 * @param pageId
 * @param skip
 * @param maxItems
 */
let getMostPopularPagesQuery = function (userId, pageId, skip, maxItems) {
    return db.cypher().match(`(page:Page {pageId: {pageId}})`)
        .optionalMatch(`(similarPage:Page)<-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(user:User)`)
        .where(`user.userId <> {userId} AND similarPage.pageId <> page.pageId AND 
                ANY(topic IN page.topic WHERE topic IN similarPage.topic) AND
                ANY(language IN page.language WHERE language IN similarPage.language) AND NOT
               (similarPage)<-[:IS_ADMIN]-(:User {userId: {userId}}) AND NOT 
               (similarPage)<-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(:User {userId: {userId}}) AND NOT
               (similarPage)<-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(:User)
                -[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(page)`)
        .with(`similarPage, COUNT(similarPage) AS countSimilarPage`)
        .where(`countSimilarPage > 0`)
        .return(`similarPage.pageId AS pageId, similarPage.title AS title, similarPage.description AS description, 
                 similarPage.label AS label, similarPage.language AS language, similarPage.link AS link, 
                 similarPage.topic AS topic, similarPage.hostname AS hostname, similarPage.text AS text, 
                 similarPage.heightPreviewImage AS heightPreviewImage, similarPage.linkEmbed AS linkEmbed, 
                 EXISTS((similarPage)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin,
                 SIZE((:User)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(similarPage)) AS numberOfRecommendations`)
        .orderBy("numberOfRecommendations DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({
            userId: userId,
            pageId: pageId,
            skip: skip,
            maxItems: maxItems
        }).send();
};

/**
 * Recommendation of similar pages. Using the recommendations of the users which have recommended the page.
 */
let getSimilarPagesRelationsQuery = function () {
    return db.cypher()
        .match(`(page:Page {pageId: {pageId}})`)
        .optionalMatch(`(page)<-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(user:User)`)
        .where(`user.userId <> {userId}`)
        .with(`user, page, EXISTS((:User {userId: {userId}})-[:IS_CONTACT]->(user)) AS isContact,
               SIZE((user)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(:Page)
               <-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(:User {userId: {userId}})) AS numberOfSameRecommendation`)
        .orderBy(`isContact DESC, numberOfSameRecommendation DESC`)
        .where(`numberOfSameRecommendation > 0`)
        .match(`(user)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(similarPage:Page)`)
        .where(`similarPage.pageId <> {pageId} AND ANY(topic IN page.topic WHERE topic IN similarPage.topic) AND
                ANY(language IN page.language WHERE language IN similarPage.language) AND NOT 
                (similarPage)<-[:IS_ADMIN]-(:User {userId: {userId}}) AND NOT 
                (:User {userId: {userId}})-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(similarPage)`);
};

let getSimilarPages = function (userId, params) {

    let commands = [], paramsCypher = {
        userId: userId,
        pageId: params.pageId,
        skip: params.skip,
        maxItems: params.maxItems
    };
    commands.push(getSimilarPagesRelationsQuery()
        .return(`COUNT(DISTINCT similarPage.pageId) AS totalNumberOfPages`).end(paramsCypher).getCommand());

    return getSimilarPagesRelationsQuery()
        .return(`count(similarPage), similarPage.pageId AS pageId, similarPage.title AS title, similarPage.description AS description, 
                 similarPage.label AS label, similarPage.language AS language, similarPage.link AS link, 
                 similarPage.topic AS topic, similarPage.hostname AS hostname, similarPage.text AS text, 
                 similarPage.heightPreviewImage AS heightPreviewImage, similarPage.linkEmbed AS linkEmbed, 
                 EXISTS((similarPage)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin, isContact, 
                 max(numberOfSameRecommendation) AS numberOfSameRecommendation,
                 SIZE((:User)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(similarPage)) AS numberOfRecommendations`)
        .orderBy("isContact DESC, numberOfSameRecommendation DESC, numberOfRecommendations DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end(paramsCypher).send(commands).then(function (resp) {
            if (resp[1].length < params.maxItems) {
                let skip = params.skip - resp[0][0].totalNumberOfPages - resp[1].length,
                    maxItems = params.maxItems - resp[1].length;
                return getMostPopularPagesQuery(userId, params.pageId, skip, maxItems).then(function (respPopular) {
                    return parseResult(resp[1], respPopular);
                });
            } else {
                return parseResult(resp[1]);
            }
        });
};

module.exports = {
    getSimilarPages: getSimilarPages
};
