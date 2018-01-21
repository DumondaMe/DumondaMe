'use strict';

const dashify = require('dashify');
const db = requireDb();
const cdn = require('elyoos-server-lib').cdn;

const getQuestions = function (questions) {
    let results = [];
    for (let questionElement of questions) {
        results.push({
            questionId: questionElement.question.questionId,
            question: questionElement.question.question,
            slug: dashify(questionElement.question.question),
            description: questionElement.question.description,
            created: questionElement.question.created,
            topic: questionElement.question.topic,
            numberOfAnswers: questionElement.numberOfAnswers,
            creator: {
                name: questionElement.creator.name,
                thumbnailUrl: cdn.getUrl(`profileImage/${questionElement.creator.userId}/thumbnail.jpg`)
            }
        });
    }
    return results;
};

const getFeed = async function (skip) {
    let response = await db.cypher().match(`(question:Question)<-[:IS_CREATOR]-(creator:User)`)
        .optionalMatch(`(question)-[:TEXT_ANSWER]->(answer:Answer)`)
        .return(`question, creator, COUNT(answer) AS numberOfAnswers`)
        .orderBy(`question.created DESC`)
        .skip(`{skip}`).limit(`20`)
        .end({skip}).send();

    return {questions: getQuestions(response)};
};

module.exports = {
    getFeed
};
