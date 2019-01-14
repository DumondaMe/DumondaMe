'use strict';

const db = requireDb();
const email = require('../../../eMailService/askAnswerQuestion');
const slug = require('limax');
const _ = require('lodash');
const exceptions = require('dumonda-me-server-lib').exceptions;

const getExistingUsers = async function (userId, usersToInvite, questionId) {
    return await db.cypher().match(`(user:User:EMailNotificationEnabled)`)
        .where(`user.userId IN {usersToInvite} AND NOT EXISTS(user.disableInviteAnswerQuestionNotification) AND NOT
                (user)-[:IS_CREATOR]->(:Question {questionId: {questionId}}) AND NOT
                (user)-[:IS_CREATOR]->(:Answer)<-[:ANSWER]-(:Question {questionId: {questionId}})`)
        .optionalMatch(`(:User {userId: {userId}})-[:ASKED_TO_ANSWER_QUESTION]->
                        (asked:AskedToAnswerQuestion)-[:ASKED]->(user)`)
        .with(`user, asked`)
        .where(`NOT EXISTS((asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: {questionId}}))`)
        .return(`user.email AS email`)
        .end({userId, usersToInvite, questionId}).send();
};

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

const inviteRegisteredUserToAnswerQuestion = async function (userId, usersToInvite, questionId) {
    let question = await getQuestion(questionId);
    let user = await getUser(userId);
    let existingUsers = await getExistingUsers(userId, usersToInvite, questionId);
    await email.askRegisteredUserAnswerQuestion(existingUsers, user, question.question, questionId,
        slug(question.question));
};

const inviteNotRegisteredUserToAnswerQuestion = async function (userId, emailsToInvite, questionId) {
    let question = await getQuestion(questionId);
    let user = await getUser(userId);
    let notExistingUsers = await getNotExistingUsers(userId, emailsToInvite.map(email => email.toLowerCase()),
        questionId);
    await email.askNotRegisteredUserAnswerQuestion(notExistingUsers, user, question.question, questionId,
        slug(question.question));
};

module.exports = {
    inviteRegisteredUserToAnswerQuestion,
    inviteNotRegisteredUserToAnswerQuestion
};
