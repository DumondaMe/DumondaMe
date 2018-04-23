'use strict';

const responseHandler = require('./../response');
const db = requireDb();
const PAGE_SIZE = 20;

const getTypeFilter = function (filter) {
    if(filter === 'question') {
        return `feedElement:Question`;
    } else if(filter === 'answer') {
        return `feedElement:Answer`;
    } else {
        return `(feedElement:Question OR feedElement:Answer)`;
    }
};

const getFeed = async function (page, timestamp, typeFilter) {
    page = page * PAGE_SIZE;
    let response = await db.cypher().match(`(feedElement)<-[:IS_CREATOR]-(creator:User)`)
        .where(`feedElement.created < {timestamp} AND ${getTypeFilter(typeFilter)}`)
        .optionalMatch(`(feedElement)-[:ANSWER]->(answer:Answer)`)
        .optionalMatch(`(question:Question)-[:ANSWER]->(feedElement)`)
        .optionalMatch(`(commitment:Commitment)<-[:COMMITMENT]-(feedElement)`)
        .return(`feedElement, question, commitment, creator, COUNT(DISTINCT answer) AS numberOfAnswers, 
                 labels(feedElement) AS type`)
        .orderBy(`feedElement.created DESC`)
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({page, timestamp}).send();

    return {feed: await responseHandler.getFeed(response), timestamp};
};

module.exports = {
    getFeed
};
