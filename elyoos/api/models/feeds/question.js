'use strict';

const dashify = require('dashify');
const db = requireDb();
const cdn = require('elyoos-server-lib').cdn;
const PAGE_SIZE = 20;

const getQuestions = async function (questions) {
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
                thumbnailUrl: await cdn.getSignedUrl(`profileImage/${questionElement.creator.userId}/thumbnail.jpg`)
            }
        });
    }
    return results;
};

const getFeed = async function (page, timestamp) {
    page = page * PAGE_SIZE;
    let response = await db.cypher().match(`(question:Question)<-[:IS_CREATOR]-(creator:User)`)
        .where(`question.created < {timestamp}`)
        .optionalMatch(`(question)-[:ANSWER]->(answer)`)
        .return(`question, creator, COUNT(answer) AS numberOfAnswers`)
        .orderBy(`question.created DESC`)
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({page, timestamp}).send();

    return {questions: await getQuestions(response), timestamp};
};

module.exports = {
    getFeed
};
