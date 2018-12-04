'use strict';

const db = requireDb();
const slug = require('limax');

const getResponse = function (popularQuestions) {
    let response = [];
    for (let popularQuestion of popularQuestions) {
        response.push({
            questionId: popularQuestion.similar.questionId,
            question: popularQuestion.similar.question,
            questionSlug: slug(popularQuestion.similar.question),
            numberOfAnswers: popularQuestion.numberOfAnswers,
        });
    }
    return response;
};

const getSimilarQuestionsCommand = function (questionId, timestamp, skip, limit) {
    return db.cypher()
        .match(`(question:Question {questionId: {questionId}})<-[:TOPIC]-(topic:Topic)-[:TOPIC]->(similar:Question)`)
        .where(`question.language = similar.language AND question.questionId <> similar.questionId AND 
                question.created < {timestamp}`)
        .with(`DISTINCT similar, count(topic) AS numberOfTopics`)
        .optionalMatch(`(similar)<-[watch:WATCH]-(user:User)`)
        .where(`watch.created < {timestamp}`)
        .with(`DISTINCT similar, numberOfTopics, count(user) AS numberOfWatches`)
        .optionalMatch(`(similar)-[:ANSWER]->(answer)<-[upVote:UP_VOTE]-(:User)`)
        .where(`upVote.created < {timestamp}`)
        .with(`DISTINCT similar, numberOfTopics, numberOfWatches, count(answer) AS numberOfUpVotes`)
        .orderBy(`numberOfTopics DESC, numberOfWatches DESC, numberOfUpVotes DESC, similar.created DESC`)
        .skip(`{skip}`).limit(`{limit}`)
        .optionalMatch(`(similar)-[:ANSWER]->(answer)`)
        .return(`DISTINCT similar, count(answer) AS numberOfAnswers, numberOfTopics, numberOfWatches, numberOfUpVotes`)
        .orderBy(`numberOfTopics DESC, numberOfWatches DESC, numberOfUpVotes DESC, similar.created DESC`)
        .end({questionId, timestamp, skip, limit});
};

const getSimilarQuestions = async function (questionId, timestamp, skip, limit) {
    let response = await getSimilarQuestionsCommand(questionId, timestamp, skip, limit).send();

    return {similarQuestions: getResponse(response)};
};

module.exports = {
    getSimilarQuestions,
    getSimilarQuestionsCommand,
    getResponse
};
