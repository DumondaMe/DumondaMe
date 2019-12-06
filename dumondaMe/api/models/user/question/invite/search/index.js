'use strict';

const usersResponse = require('./response');
const db = requireDb();

const searchCommand = function (email, questionId) {
    return db.cypher().match(`(user {emailNormalized: {email}})`)
        .where(`(user:User OR user:InvitedUser)`)
        .optionalMatch(`(user)<-[:ASKED]->(asked:AskedToAnswerQuestion)-[:QUESTION_TO_ANSWER]->
                        (:Question {questionId: {questionId}})`)
        .return(`DISTINCT user, EXISTS((asked)-[:ASKED]->(user)) AS hasAlreadyAsked, LABELS(user) AS userLabels`)
        .end({email: email.toLowerCase(), questionId});
};

const search = async function (email, questionId) {
    let user = await searchCommand(email, questionId).send();
    let parsedUser = usersResponse.getResponse(user, email);
    return {user: parsedUser};
};

module.exports = {
    search
};
