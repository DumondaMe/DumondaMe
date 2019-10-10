/**
 * A model for the user
 */
'use strict';

const db = requireDb();
const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');

let getQuestionResponse = function (dbResponse) {
    let questions = [];
    for (let dbRow of dbResponse) {
        let question = {
            type: 'HarvestingQuestion',
            questionId: dbRow.question.questionId,
            question: dbRow.question.question,
            questionSlug: slug(dbRow.question.question),
            numberOfAnswers: dbRow.numberOfAnswers
        };
        if (dbRow.question.description) {
            question.description = dbRow.question.description;
            question.descriptionHtml = linkifyHtml(dbRow.question.description, {attributes: {rel: 'noopener'}});
        }
        questions.push(question);
    }
    return questions;
};

let getFeed = async function (userIdOfProfile) {

    let resp = await db.cypher()
        .match(`(u:User:HarvestingUser {userId: {userIdOfProfile}})`)
        .optionalMatch(`(u)-[:IS_CREATOR]->(question:Question)`)
        .optionalMatch(`(u)-[:IS_CREATOR]->(:Answer)<-[:ANSWER]-(question2:Question)`)
        .with(`[question, question2] AS allQuestions`)
        .unwind(`allQuestions AS question`)
        .with(`question`)
        .where(`EXISTS(question.questionId)`)
        .optionalMatch(`(question)-[:ANSWER]->(answer:Answer)`)
        .return(`DISTINCT question, COUNT (DISTINCT answer) AS numberOfAnswers`)
        .orderBy(`question.created`)
        .end({userIdOfProfile}).send();
    return getQuestionResponse(resp);
};

module.exports = {
    getFeed
};
