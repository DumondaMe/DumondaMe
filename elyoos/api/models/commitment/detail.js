'use strict';

const dashify = require('dashify');
const db = requireDb();
const events = require('./events');
const cdn = require('elyoos-server-lib').cdn;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const getLinkedQuestionResponse = function (questions) {
    const linkedQuestions = [];
    for (let question of questions) {
        linkedQuestions.push({
            questionId: question.question.questionId,
            question: question.question.question,
            description: question.question.description,
            slug: dashify(question.question.question),
            upVotes: question.upVotes
        })
    }
    return linkedQuestions;
};

const getLinkedQuestions = function (commitmentId) {
    return db.cypher().match(`(c:Commitment {commitmentId: {commitmentId}})-[:SHOW_QUESTION]->(q:Question)
                               -[:ANSWER]->(a:CommitmentAnswer)-[:COMMITMENT]->(c)`)
        .optionalMatch(`(a)<-[:UP_VOTE]-(upVoteUser:User)`)
        .return(`DISTINCT q AS question, count(upVoteUser) AS upVotes`)
        .orderBy(`upVotes DESC`)
        .end({commitmentId}).getCommand();
};

const getDetail = async function (userId, commitmentId) {
    let resp = await db.cypher().match("(c:Commitment {commitmentId: {commitmentId}})<-[:IS_ADMIN]-(user:User)")
        .optionalMatch(`(t:Topic)-[:TOPIC]->(c)`)
        .optionalMatch(`(r:Region)<-[:BELONGS_TO_REGION]-(c)`)
        .optionalMatch(`(:User)-[w:WATCH]->(c)`)
        .return(`c.title AS title, c.description AS description, c.website AS website, c.created AS created,
                 c.modified AS modified, c.language AS lang, count(DISTINCT w) AS numberOfWatches,
                 EXISTS((:User {userId: {userId}})-[:WATCH]->(c)) AS userWatchesCommitment,
                 EXISTS((:User {userId: {userId}})-[:IS_ADMIN]->(c)) AS isAdmin,
                 collect(DISTINCT t.name) AS topics, collect(DISTINCT r.code) AS regions`)
        .end({userId, commitmentId}).send([getLinkedQuestions(commitmentId), events.getEventsCommand(commitmentId)]);
    if (resp[2].length !== 1) {
        logger.warn(`Commitment ${commitmentId} had ${resp.length} results`);
        throw new Error('404');
    }
    let response = resp[2][0];
    response.imageUrl = cdn.getPublicUrl(`commitment/${commitmentId}/148x148/title.jpg`, response.modified);
    response.linkedWithQuestions = getLinkedQuestionResponse(resp[0]);
    response.events = resp[1];
    logger.info(`Get commitment ${commitmentId}`);
    return response;
};

module.exports = {
    getDetail
};
