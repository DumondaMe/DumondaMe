'use strict';

const db = requireDb();
const security = require('./security');
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const hasAnswers = async function (questionId) {
    let result = await db.cypher().match(`(question:Question {questionId: {questionId}})`)
        .optionalMatch(`(question)-[:TEXT_ANSWER]->(answer:Answer)`)
        .return(`COUNT(answer) AS numberOfAnswers`)
        .end({questionId: questionId}).send();
    return result[0].numberOfAnswers > 0;
};

const deleteQuestion = async function (userId, questionId) {

    let markedForDeletion = false;
    await security.isAdmin(userId, questionId);
    if (await hasAnswers(questionId)) {
        await db.cypher().match(`(question:Question {questionId: {questionId}})`)
            .addCommand(` SET question:DeleteRequested`)
            .set(`question`, {timeDeleteRequested: time.getNowUtcTimestamp()})
            .end({questionId: questionId}).send();
        logger.info(`Question with id ${questionId} marked to delete`);
        markedForDeletion = true;
    } else {
        await db.cypher().match(`(question:Question {questionId: {questionId}})<-[isAdmin:IS_CREATOR]-(:User)`)
            .delete(`question, isAdmin`)
            .end({questionId: questionId}).send();
        logger.info(`Deleted question with id ${questionId}`);
    }
    return {markedForDeletion: markedForDeletion};
};

module.exports = {
    deleteQuestion
};
