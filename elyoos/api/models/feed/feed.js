'use strict';

const responseHandler = require('./response');
const feedElementCounter = require('./feedElementCounter');
const filter = require('./filter');
const db = requireDb();
const PAGE_SIZE = 20;

const getOrderBy = function (typeFilter) {
    if (typeFilter === 'event') {
        return 'feedElement.startDate';
    }
    return 'feedElement.created DESC';
};

const getFeed = async function (page, timestamp, typeFilter, language) {
    page = page * PAGE_SIZE;
    let response = await db.cypher().match(`(feedElement)<-[:IS_CREATOR|:EVENT]-(creator)`)
        .where(`feedElement.created < {timestamp} AND (creator:User OR creator:Commitment) AND 
                ${filter.getTypeFilter(typeFilter, language)}`)
        .optionalMatch(`(feedElement)-[:ANSWER]->(answer:Answer)`)
        .optionalMatch(`(feedElement)-[:BELONGS_TO_REGION]->(region:Region)`)
        .return(`feedElement, creator, COUNT(DISTINCT answer) AS numberOfAnswers,
                 collect(DISTINCT region.code) AS regions, labels(feedElement) AS type`)
        .orderBy(getOrderBy(typeFilter))
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({page, timestamp})
        .send([feedElementCounter.getTotalNumberOfFeedElements(timestamp, typeFilter, language)]);

    return {
        feed: await responseHandler.getFeed(response[1]), totalNumberOfElements: response[0][0].numberOfElements,
        timestamp
    };
};

module.exports = {
    getFeed
};
