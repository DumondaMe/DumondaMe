'use strict';

const db = requireDb();

const getResponse = function (users) {
    let response = [];
    for (let user of users) {
        response.push({
            email: user.user.emailNormalized
        })
    }
    return response;
};

const getInvitationsAlreadySent = async function (userId, questionId) {
    let users = await db.cypher()
        .match(`(:User {userId: {userId}})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)
                -[:ASKED]->(user:InvitedUser)`)
        .where(`EXISTS((asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: {questionId}}))`)
        .return(`user`).orderBy(`user.emailNormalized`)
        .end({userId, questionId}).send();
    return {users: getResponse(users)}
};

module.exports = {
    getInvitationsAlreadySent
};
