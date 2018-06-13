'use strict';

const db = requireDb();

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

let getAnswer = async function (userId, questionsPerPage, skipQuestions, isWatching) {
    let questions = await getAnswerCommand(userId, questionsPerPage, skipQuestions, isWatching)
        .send([numberOfAnswers(userId, isWatching).getCommand()]);
    return {};
};


module.exports = {
    numberOfAnswers,
    getAnswerCommand,
    getAnswer
};
