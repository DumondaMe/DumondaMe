'use strict';

const responseHandler = require('./response');
const feedElementCounter = require('./feedElementCounter');
const filter = require('./filter');
const db = requireDb();
const PAGE_SIZE = 20;

const getFeed = async function (page, timestamp, typeFilter) {
    page = page * PAGE_SIZE;
    let response = await db.cypher().match(`(feedElement)<-[:IS_CREATOR]-(creator:User)`)
        .where(`feedElement.created < {timestamp} AND ${filter.getTypeFilter(typeFilter)}`)
        .optionalMatch(`(feedElement)-[:ANSWER]->(answer:Answer)`)
        .optionalMatch(`(feedElement)-[:BELONGS_TO_REGION]->(region:Region)`)
        .return(`feedElement, creator, COUNT(DISTINCT answer) AS numberOfAnswers, 
                 collect(DISTINCT region.code) AS regions, labels(feedElement) AS type`)
        .orderBy(`feedElement.created DESC`)
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({page, timestamp}).send([feedElementCounter.getTotalNumberOfFeedElements(timestamp, typeFilter)]);

    return {
        feed: responseHandler.getFeed(response[1]), totalNumberOfElements: response[0][0].numberOfElements,
        timestamp
    };
};

module.exports = {
    getFeed
};
