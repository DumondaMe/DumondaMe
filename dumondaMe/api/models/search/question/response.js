'use strict';

const slug = require('limax');
const cdn = require('dumonda-me-server-lib').cdn;
const linkifyHtml = require('linkifyjs/html');

const getResponse = async function (questions, userId) {
    let response = [];
    for (let question of questions) {
        let questionResponse = {
            questionId: question.question.questionId,
            question: question.question.question,
            slug: slug(question.question.question),
            isAdmin: question.isAdmin,
            numberOfAnswers: question.numberOfAnswers,
            numberOfWatches: question.numberOfWatches,
            isWatchedByUser: question.isWatchedByUser
        };
        if (question.question.description) {
            questionResponse.description = question.question.description;
            questionResponse.descriptionHtml = linkifyHtml(question.question.description,
                {attributes: {rel: 'noopener'}});
        }
        questionResponse.user = {
            userId: question.admin.userId,
            name: question.admin.name,
            slug: slug(question.admin.name),
            userImage: await cdn.getSignedUrl(`profileImage/${question.admin.userId}/thumbnail.jpg`),
            userImagePreview: await cdn.getSignedUrl(`profileImage/${question.admin.userId}/profilePreview.jpg`),
            isLoggedInUser: question.admin.userId === userId,
            isTrustUser: question.isTrustUser
        };
        response.push(questionResponse);
    }
    return response;
};

module.exports = {
    getResponse
};
