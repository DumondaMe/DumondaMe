'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;

const getQuestion = async function (userId, questionId) {
    let response = await db.cypher().match("(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(user:User)")
        .return(`question, user`)
        .end({questionId: questionId}).send();
    if (response.length === 1) {
        delete response[0].question.questionId;
        let jsonResponse = response[0].question;
        jsonResponse.creator = {
            name: response[0].user.name,
            thumbnailUrl: `profileImage/${response[0].user.userId}/thumbnail.jpg` //todo apply new privacy settings
        };
        return jsonResponse;
    } else {
        throw new exceptions.InvalidOperation(`Question with id ${questionId} not found`);
    }
};

module.exports = {
    getQuestion
};
