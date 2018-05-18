'use strict';

const db = requireDb();
const dashify = require('dashify');
const time = require('elyoos-server-lib').time;

const FOUR_WEEKS = 2419200;

const addQuestionSlug = function (popularQuestions) {
    for (let popularQuestion of popularQuestions) {
        popularQuestion.questionSlug = dashify(popularQuestion.question);
    }
    return popularQuestions;
};

const getPopularQuestions = async function (language) {
    let response = await db.cypher().match(`(question:Question)-[:ANSWER]->(answer:Answer)`)
        .where(`question.language = {language}`)
        .optionalMatch(`(answer)<-[upVotes:UP_VOTE]-(:User)`)
        .optionalMatch(`(question)<-[watches:WATCH]-(:User)`)
        .with(`question, answer, upVotes, watches`)
        .where(`answer.created > {fourWeeks} OR upVotes.created > {fourWeeks} OR watches.created > {fourWeeks}`)
        .with(`question, [count(DISTINCT answer), count(DISTINCT upVotes), count(DISTINCT watches)] AS scoreList`)
        .with(`question, reduce(totalScore = 0, n IN scoreList | totalScore + n) AS score`)
        .optionalMatch(`(question)<-[watches:WATCH]-(:User)`)
        .optionalMatch(`(question)-[answer:ANSWER]-(:Answer)`)
        .return(`question.questionId AS questionId, question.question AS question, 
                 count(DISTINCT answer) AS numberOfAnswers,
                 count(DISTINCT watches) AS numberOfWatches, score`)
        .orderBy(`score DESC`)
        .limit(10)
        .end({language, fourWeeks: time.getNowUtcTimestamp() - FOUR_WEEKS}).send();

    return {popularQuestions: addQuestionSlug(response)};
};

module.exports = {
    getPopularQuestions
};
