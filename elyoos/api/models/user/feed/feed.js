'use strict';

const responseHandler = require('./response');
const feedElementCounter = require('./feedElementCounter');
const db = requireDb();
const PAGE_SIZE = 20;

const getFeed = async function (userId, page, timestamp, typeFilter) {
    page = page * PAGE_SIZE;
    let response = await db.cypher()
        .match(`(user:User {userId: {userId}})-[relWatch:WATCH|IS_CONTACT]->(watch)
                -[relAction:UP_VOTE|:WATCH|:IS_CREATOR|:ANSWER]->(feedElement)`)
        .where(`(watch:User OR watch:Question OR watch:Commitment) AND 
                (feedElement:Answer OR feedElement:Commitment OR feedElement:Question)`)
        .optionalMatch(`(feedElement)-[:ANSWER]->(answer:Answer)`)
        .optionalMatch(`(feedElement)-[:BELONGS_TO_REGION]->(region:Region)`)
        .optionalMatch(`(feedElement)<-[:IS_CREATOR]-(creator:User)`)
        .optionalMatch(`(feedElement)<-[:ANSWER]-(question:Question)`)
        .optionalMatch(`(feedElement)-[:COMMITMENT]-(commitment:Commitment)`)
        .unwind(`[relAction.created, feedElement.created] AS tempCreated`)
        .return(`DISTINCT feedElement, watch, creator, question, commitment, COUNT(DISTINCT answer) AS numberOfAnswers, 
                 collect(DISTINCT region.code) AS regions, labels(feedElement) AS type, 
                 max(tempCreated) AS created,
                 type(relAction) AS relAction, type(relWatch) AS relWatch`)
        .orderBy(`created DESC`)
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({userId, page, timestamp})
        .send([feedElementCounter.getTotalNumberOfFeedElements(userId, timestamp, typeFilter)]);

    return {
        feed: responseHandler.getFeed(response[1]), totalNumberOfElements: response[0][0].numberOfElements,
        timestamp
    };
};

module.exports = {
    getFeed
};
