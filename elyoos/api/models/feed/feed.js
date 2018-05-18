'use strict';

const responseHandler = require('./response');
const feedElementCounter = require('./feedElementCounter');
const popularQuestion = require('./popularQuestion');
const filter = require('./filter');
const dashify = require('dashify');
const db = requireDb();
const PAGE_SIZE = 20;

const addQuestionSlug = function (popularQuestions) {
    for (let popularQuestion of popularQuestions) {
        popularQuestion.questionSlug = dashify(popularQuestion.question);
    }
    return popularQuestions;
};

const getFeed = async function (page, timestamp, typeFilter, language) {
    page = page * PAGE_SIZE;
    let response = await db.cypher().match(`(feedElement)<-[:IS_CREATOR]-(creator:User)`)
        .where(`feedElement.created < {timestamp} AND ${filter.getTypeFilter(typeFilter, language)}`)
        .optionalMatch(`(feedElement)-[:ANSWER]->(answer:Answer)`)
        .optionalMatch(`(feedElement)-[:BELONGS_TO_REGION]->(region:Region)`)
        .return(`feedElement, creator, COUNT(DISTINCT answer) AS numberOfAnswers, 
                 collect(DISTINCT region.code) AS regions, labels(feedElement) AS type`)
        .orderBy(`feedElement.created DESC`)
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({page, timestamp})
        .send([feedElementCounter.getTotalNumberOfFeedElements(timestamp, typeFilter, language),
            popularQuestion.getPopularQuestions(language)]);

    return {
        feed: responseHandler.getFeed(response[2]), totalNumberOfElements: response[0][0].numberOfElements,
        timestamp, popularQuestions: addQuestionSlug(response[1])
    };
};

module.exports = {
    getFeed
};
