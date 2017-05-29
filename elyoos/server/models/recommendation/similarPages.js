'use strict';

let db = requireDb();
let _ = require('lodash');

let parseResult = function (queryResult, queryResult2) {
    let combined = _.concat(queryResult, queryResult2), result = [];
    combined.forEach(function (page) {
        let similarPage = {};
        similarPage.pageId = page.similarPage.pageId;
        similarPage.label = page.similarPage.label;
        result.push(similarPage);
    });
    return {pages: result};
};

let getMostPopularPagesQuery = function (userId, pageId, skip, maxItems) {
    return db.cypher().match(`(page:Page {pageId: {pageId}})`)
        .optionalMatch(`(similarPage:Page)<-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(user:User)`)
        .where(`user.userId <> {userId} AND similarPage.pageId <> page.pageId AND NOT
               (similarPage)<-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(:User {userId: {userId}}) AND NOT
               (similarPage)<-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(:User)
                -[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(page)`)
        .return(`similarPage, SIZE((:User)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(similarPage)) AS numberOfRecommendations,
                 COUNT(similarPage)`)
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
        .with(`user, EXISTS((:User {userId: {userId}})-[:IS_CONTACT]->(user)) AS isContact,
               SIZE((user)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(:Page)
               <-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(:User {userId: {userId}})) AS numberOfSameRecommendation`)
        .orderBy(`isContact DESC, numberOfSameRecommendation DESC`)
        .where(`numberOfSameRecommendation > 0`)
        .match(`(user)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(similarPage:Page)`)
        .where(`similarPage.pageId <> {pageId} AND NOT 
                (:User {userId: {userId}})-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(similarPage)`)
};

let getSimilarPages = function (userId, params) {

    let commands = [], paramsCypher = {
        userId: userId,
        pageId: params.pageId,
        skip: params.skip,
        maxItems: params.maxItems
    };
    commands.push(getSimilarPagesRelationsQuery()
        .return(`COUNT(*) AS totalNumberOfPages`).end(paramsCypher).getCommand());

    return getSimilarPagesRelationsQuery()
        .return(`similarPage, SIZE((:User)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(similarPage)) AS numberOfRecommendations`)
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
