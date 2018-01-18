'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;

const getQuestion = async function (userId, questionId) {
    let response = await db.cypher().match("(question:Question {questionId: {questionId}})")
        .return(`question`)
        .end({questionId: questionId}).send();
    if (response.length === 1) {
        delete response[0].question.questionId;
        return response[0].question;
    } else {
        throw new exceptions.InvalidOperation(`Question with id ${questionId} not found`);
    }
};

module.exports = {
    getQuestion
};
