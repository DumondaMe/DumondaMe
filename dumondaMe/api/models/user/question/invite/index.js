'use strict';

const db = requireDb();
const email = require('../../../eMailService/askAnswerQuestion');
const slug = require('limax');
const _ = require('lodash');
const exceptions = require('dumonda-me-server-lib').exceptions;

const getNotExistingUsers = async function (userId, emails, questionId) {
    let existingUsers = await db.cypher()
        .match(`(user)`)
        .where(`user.emailNormalized IN {emails} AND (user:User OR user:InvitedUser)`)
        .optionalMatch(`(:User {userId: {userId}})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)
                        -[:ASKED]->(user)`)
        .with(`user, asked`)
        .where(`(asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: {questionId}}) OR 
                NOT user:EMailNotificationEnabled`)
        .return(`user.emailNormalized AS email`)
        .end({userId, emails, questionId}).send();
    let notExistingUsers = _.difference(emails, existingUsers.map((user) => user.email));
    return notExistingUsers.map((email) => {
        return {email}
    });
};

const getQuestion = async function (questionId) {
    let question = await db.cypher().match(`(question:Question {questionId: {questionId}})`)
        .return(`question.question AS question`)
        .end({questionId}).send();
    if (question.length === 1) {
        return question[0];
    }
    throw new exceptions.InvalidOperation(`Question ${questionId} does not exists`);
};

const getUser = async function (userId) {
    let user = await db.cypher().match(`(user:User {userId: {userId}})`)
        .return(`user.userId AS userId, user.name AS name`)
        .end({userId}).send();
    if (user.length === 1) {
        return user[0];
    }
    throw new exceptions.InvalidOperation(`User ${userId} does not exists`);
};


const inviteNotRegisteredUserToAnswerQuestion = async function (userId, emailsToInvite, questionId, req) {
    let question = await getQuestion(questionId);
    let user = await getUser(userId);
    let notExistingUsers = await getNotExistingUsers(userId, emailsToInvite.map(email => email.toLowerCase()),
        questionId);
    await email.askNotRegisteredUserAnswerQuestion(notExistingUsers, user, question.question, questionId,
        slug(question.question), req);
};

module.exports = {
    inviteNotRegisteredUserToAnswerQuestion
};
