'use strict';

const db = requireDb();
const security = require('./security');
const answerResponseHandler = require('./../feed/response');

let getRelation = function (hasUpVoted) {
    if (hasUpVoted) {
        return `relAction:UP_VOTE`
    }
    return `relAction:IS_CREATOR`
};

let getCreated = function (hasUpVoted) {
    if (hasUpVoted) {
        return `relAction.created AS created`
    }
    return `feedElement.created AS created`
};

let numberOfAnswers = function (userId, hasUpVoted) {
    return db.cypher().match(`(user:User {userId: {userId}})-[${getRelation(hasUpVoted)}]->(:Answer)`)
        .return('count(*) AS numberOfAnswers')
        .end({userId});
};

let getAnswerCommand = function (userId, answersPerPage, skipAnswer, hasUpVoted) {
    return db.cypher()
        .match(`(user:User {userId: {userId}})-[${getRelation(hasUpVoted)}]->(feedElement:Answer)`)
        .optionalMatch(`(feedElement)-[:BELONGS_TO_REGION]->(region:Region)`)
        .optionalMatch(`(feedElement)<-[:IS_CREATOR]-(creator:User)`)
        .optionalMatch(`(feedElement)<-[:ANSWER]-(question:Question)`)
        .optionalMatch(`(feedElement)-[:COMMITMENT]-(commitment:Commitment)-[:BELONGS_TO_REGION]->(rca:Region)`)
        .unwind(`[relAction.created, feedElement.created] AS tempCreated`)
        .return(`DISTINCT feedElement, creator, question, commitment,
                 collect(DISTINCT region.code) AS regions, labels(feedElement) AS type, 
                 collect(DISTINCT rca.code) AS commitmentAnswerRegions,
                 ${getCreated(hasUpVoted)}, type(relAction) AS relAction`)
        .orderBy(`created DESC`)
        .skip(`{skipAnswer}`)
        .limit(`{answersPerPage}`)
        .end({userId, answersPerPage, skipAnswer});
};

let getAnswer = async function (userId, userDetailId, answersPerPage, skipAnswers, upVoted, req) {
    await security.checkAllowedToGetProfile(userId, userDetailId, req);

    let response = await getAnswerCommand(userDetailId, answersPerPage, skipAnswers, upVoted)
        .send([numberOfAnswers(userDetailId, upVoted).getCommand()]);
    return {
        answers: answerResponseHandler.getAnswersWithoutCreator(response[1]),
        numberOfAnswers: response[0][0].numberOfAnswers
    };
};


module.exports = {
    numberOfAnswers,
    getAnswerCommand,
    getAnswer
};
