'use strict';

const db = requireDb();
const dashify = require('dashify');
const linkifyHtml = require('linkifyjs/html');

let getRelation = function (isWatching) {
    if (isWatching) {
        return `watch:WATCH`
    }
    return `:IS_CREATOR`
};

let getCreated = function (isWatching) {
    if (isWatching) {
        return `watch.created AS created`
    }
    return `commitment.created AS created`
};

let handlingResponseOfCommitment = function (commtiments) {
    for (let commitment of commtiments) {
        commitment.commitmentSlug = dashify(commitment.title);
    }
};

let numberOfCommitments = function (userId, isWatching) {
    return db.cypher().match(`(user:User {userId: {userId}})-[${getRelation(isWatching)}]->(:Commitment)`)
        .return('count(*) AS numberOfCommitments')
        .end({userId});
};

let getCommitmentCommand = function (userId, questionsPerPage, skipQuestions, isWatching) {
    return db.cypher().match(`(user:User {userId: {userId}})-[${getRelation(isWatching)}]->(commitment:Commitment)`)
        .optionalMatch(`(commitment)-[:SHOW_QUESTION]->(question:Question)`)
        .optionalMatch(`(commitment)<-[:WATCH]-(watchingUser:User)`)
        .return(`commitment.commitmentId AS commitmentId, commitment.title AS title, 
                 commitment.description AS description, ${getCreated(isWatching)}, 
                 count(DISTINCT question) AS numberOfLinkedQuestions, 
                 count(DISTINCT watchingUser) AS numberOfWatches`)
        .orderBy(`created DESC`)
        .skip(`{skipQuestions}`)
        .limit(`{questionsPerPage}`)
        .end({userId, questionsPerPage, skipQuestions});
};

let getCommitment = async function (userId, questionsPerPage, skipQuestions, isWatching) {
    let questions = await getCommitmentCommand(userId, questionsPerPage, skipQuestions, isWatching)
        .send([numberOfCommitment(userId, isWatching).getCommand()]);
    return {};
};


module.exports = {
    numberOfCommitments,
    handlingResponseOfCommitment,
    getCommitmentCommand,
    getCommitment
};
