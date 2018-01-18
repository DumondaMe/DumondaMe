'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;

const isAdmin = async function (userId, questionId) {

    let response = await db.cypher().match(`(question:Question {questionId: {questionId}})
                 <-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .return(`question`)
        .end({questionId: questionId, userId: userId}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`User ${userId} is not admin of question ${questionId}`);
    }
};

module.exports = {
    isAdmin
};
