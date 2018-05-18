'use strict';

const db = requireDb();
const time = require('elyoos-server-lib').time;

const FOUR_WEEKS = 2419200;

const getPopularQuestions = function (language) {
    return db.cypher().match(`(question:Question)-[:ANSWER]->(answer:Answer)`)
        .where(`question.language = {language}`)
        .optionalMatch(`(answer)<-[upVotes:UP_VOTE]-(:User)`)
        .optionalMatch(`(question)<-[watches:WATCH]-(:User)`)
        .with(`question, answer, upVotes, watches`)
        .where(`answer.created > {twoWeeks} OR upVotes.created > {twoWeeks} OR watches.created > {twoWeeks}`)
        .with(`question, [count(DISTINCT answer), count(DISTINCT upVotes), count(DISTINCT watches)] AS scoreList`)
        .with(`question, reduce(totalScore = 0, n IN scoreList | totalScore + n) AS score`)
        .optionalMatch(`(question)<-[watches:WATCH]-(:User)`)
        .optionalMatch(`(question)-[answer:ANSWER]-(:Answer)`)
        .return(`question.questionId AS questionId, question.question AS question, 
                 count(DISTINCT answer) AS numberOfAnswers,
                 count(DISTINCT watches) AS numberOfWatches, score`)
        .orderBy(`score DESC`)
        .limit(10)
        .end({language, twoWeeks: time.getNowUtcTimestamp() - FOUR_WEEKS}).getCommand();
};

module.exports = {
    getPopularQuestions
};
