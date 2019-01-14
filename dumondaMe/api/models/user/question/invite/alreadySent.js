'use strict';

const db = requireDb();
const cdn = require('dumonda-me-server-lib').cdn;

const getResponse = async function (users) {
    let response = [];
    for (let user of users) {
        if (user.user.hasOwnProperty('userId')) {
            response.push({
                userId: user.user.userId,
                name: user.user.name,
                userImage: await cdn.getSignedUrl(`profileImage/${user.user.userId}/thumbnail.jpg`)
            })
        } else {
            response.push({
                email: user.user.emailNormalized
            })
        }
    }
    return response;
};

const getInvitationsAlreadySent = async function (userId, questionId) {
    let users = await db.cypher()
        .match(`(:User {userId: {userId}})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)
                -[:ASKED]->(user)`)
        .where(`EXISTS((asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: {questionId}})) AND
                (user:User OR user:InvitedUser)`)
        .return(`user`).orderBy(`user.name, user.emailNormalized`)
        .end({userId, questionId}).send();
    return {users: await getResponse(users)}
};

module.exports = {
    getInvitationsAlreadySent
};
