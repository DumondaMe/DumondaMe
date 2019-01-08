"use strict";

const db = requireDb();
const tmp = require('tmp');
const email = require('dumonda-me-server-lib').eMail;
const cdn = require('dumonda-me-server-lib').cdn;
const fs = require('fs');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const getUserImage = async function (userId) {
    let imageData, userImage = tmp.fileSync({postfix: '.jpg'});
    imageData = await cdn.getObject(`profileImage/${userId}/profile.jpg`);
    fs.writeFileSync(userImage.name, imageData.Body);
    return userImage;
};

const setSentToRegisteredUser = async function (userId, questionId, sentEmails) {
    await db.cypher()
        .match(`(user:User {userId: {userId}}), (askedUser:User), (question:Question {questionId: {questionId}})`)
        .where(`askedUser.email IN {sentEmails}`)
        .merge(`(user)-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:QUESTION_TO_ANSWER]->(question)`)
        .merge(`(asked)-[:ASKED]->(askedUser)`)
        .end({userId, questionId, sentEmails}).send();
};

const setSentToNotRegisteredUser = async function (userId, questionId, sentEmails) {
    await db.cypher()
        .match(`(user:User {userId: {userId}}), (question:Question {questionId: {questionId}})`)
        .merge(`(user)-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:QUESTION_TO_ANSWER]->(question)`)
        .with(`asked`)
        .unwind(`{sentEmails} AS sentEmail`)
        .with(`asked, sentEmail`)
        .merge(`(invitedUser:InvitedUser {email: sentEmail, emailNormalized: sentEmail})`)
        .merge(`(asked)-[:ASKED]->(invitedUser)`)
        .end({userId, questionId, sentEmails}).send();
};

const sendAskUserToAnswerQuestion = async function (users, sendingUser, question, questionId, questionSlug, emailType) {
    let userImage = await getUserImage(sendingUser.userId);
    let sentEmails = [];
    for (let user of users) {
        try {
            let questionLink = `${process.env.DUMONDA_ME_DOMAIN}question/${questionId}/${questionSlug}`;
            await email.sendEMail(emailType, {
                name: sendingUser.name, questionLink, userImage: userImage, question
            }, 'de', user.email);
            sentEmails.push(user.email);
        } catch (error) {
            logger.warn(`Sending ask user ${user.email} to answer question failed`)
        }
    }
    if (userImage && userImage.removeCallback) {
        userImage.removeCallback();
    }
    return sentEmails;
};

const askRegisteredUserAnswerQuestion = async function (users, sendingUser, question, questionId, questionSlug) {
    if (users.length > 0) {
        let sentEmails = await sendAskUserToAnswerQuestion(users, sendingUser, question, questionId, questionSlug,
            "askRegisteredUserAnswerQuestion");
        await setSentToRegisteredUser(sendingUser.userId, questionId, sentEmails);
    }
};

const askNotRegisteredUserAnswerQuestion = async function (users, sendingUser, question, questionId, questionSlug) {
    if (users.length > 0) {
        let sentEmails = await sendAskUserToAnswerQuestion(users, sendingUser, question, questionId, questionSlug,
            "askNotRegisteredUserAnswerQuestion");
        await setSentToNotRegisteredUser(sendingUser.userId, questionId, sentEmails);
    }
};

module.exports = {
    askRegisteredUserAnswerQuestion,
    askNotRegisteredUserAnswerQuestion
};
