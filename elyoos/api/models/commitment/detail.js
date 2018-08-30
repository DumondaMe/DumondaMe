'use strict';

const slug = require('limax');
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
            slug: slug(question.question.question),
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

const getDetail = async function (userId, commitmentId, language) {
    let resp = await db.cypher().match("(c:Commitment {commitmentId: {commitmentId}})<-[:IS_ADMIN]-(user:User)")
        .optionalMatch(`(t:Topic)-[:TOPIC]->(c)`)
        .optionalMatch(`(r:Region)<-[:BELONGS_TO_REGION]-(c)`)
        .optionalMatch(`(:User)-[w:WATCH]->(c)`)
        .return(`c.title AS title, c.description AS description, c.website AS website, c.created AS created,
                 c.modified AS modified, c.language AS lang, count(DISTINCT w) AS numberOfWatches,
                 EXISTS((:User {userId: {userId}})-[:WATCH]->(c)) AS userWatchesCommitment,
                 EXISTS((:User {userId: {userId}})-[:IS_ADMIN]->(c)) AS isAdmin,
                 collect(DISTINCT {description: t.${language}, id: t.topicId}) AS topics, 
                 collect(DISTINCT {description: r.${language}, id: r.regionId}) AS regions`)
        .end({userId, commitmentId}).send([getLinkedQuestions(commitmentId),
            events.getEventsCommand(commitmentId, true, 0, language).getCommand(),
            events.getTotalNumberOfEventsCommand(commitmentId, true).getCommand()]);
    if (resp[3].length !== 1) {
        logger.warn(`Commitment ${commitmentId} had ${resp.length} results`);
        throw new Error('404');
    }
    let response = resp[3][0];
    response.imageUrl = cdn.getPublicUrl(`commitment/${commitmentId}/210x210/title.jpg`, response.modified);
    response.linkedWithQuestions = getLinkedQuestionResponse(resp[0]);
    response.events = resp[1];
    response.totalNumberOfEvents = resp[2][0].numberOfEvents;
    logger.info(`Get commitment ${commitmentId}`);
    return response;
};

module.exports = {
    getDetail
};
