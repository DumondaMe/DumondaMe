'use strict';

const db = requireDb();
const dashify = require('dashify');
const security = require('./security');
const cdn = require('elyoos-server-lib').cdn;

let getRelation = function (isWatching) {
    if (isWatching) {
        return `watch:WATCH`
    }
    return `:IS_ADMIN`
};

let getCreated = function (isWatching) {
    if (isWatching) {
        return `watch.created AS created`
    }
    return `commitment.created AS created`
};

let handlingResponseOfCommitment = function (commitments) {
    for (let commitment of commitments) {
        commitment.commitmentSlug = dashify(commitment.title);
        commitment.imageUrl = cdn.getPublicUrl(`commitment/${commitment.commitmentId}/120x120/title.jpg`);
        if (commitment.modified) {
            commitment.imageUrl += `?v=${commitment.modified}`;
        }
    }
    return commitments;
};

let numberOfCommitments = function (userId, isWatching) {
    return db.cypher().match(`(user:User {userId: {userId}})-[${getRelation(isWatching)}]->(:Commitment)`)
        .return('count(*) AS numberOfCommitments')
        .end({userId});
};

let getCommitmentCommand = function (userId, commitmentPerPage, skipCommitment, isWatching) {
    return db.cypher().match(`(user:User {userId: {userId}})-[${getRelation(isWatching)}]->(commitment:Commitment)`)
        .optionalMatch(`(commitment)-[:SHOW_QUESTION]->(question:Question)`)
        .optionalMatch(`(commitment)<-[:WATCH]-(watchingUser:User)`)
        .return(`commitment.commitmentId AS commitmentId, commitment.title AS title, 
                 commitment.description AS description, ${getCreated(isWatching)}, commitment.modified AS modified,
                 count(DISTINCT question) AS numberOfLinkedQuestions, 
                 count(DISTINCT watchingUser) AS numberOfWatches`)
        .orderBy(`created DESC`)
        .skip(`{skipCommitment}`)
        .limit(`{commitmentPerPage}`)
        .end({userId, commitmentPerPage, skipCommitment});
};

let getCommitment = async function (userId, userDetailId, commitmentPerPage, skipCommitment, isWatching, req) {
    await security.checkAllowedToGetProfile(userId, userDetailId, req);

    let response = await getCommitmentCommand(userDetailId, commitmentPerPage, skipCommitment, isWatching)
        .send([numberOfCommitments(userDetailId, isWatching).getCommand()]);
    return {
        commitments: handlingResponseOfCommitment(response[1]), numberOfCommitments: response[0][0].numberOfCommitments
    };
};


module.exports = {
    numberOfCommitments,
    handlingResponseOfCommitment,
    getCommitmentCommand,
    getCommitment
};
