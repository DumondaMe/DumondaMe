'use strict';

const cdn = require('dumonda-me-server-lib').cdn;
const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');

const getResponse = async function (userId, name, params, oneTimeNotificationCreated) {
    let response = {
        oneTimeNotificationCreated,
        answerId: params.answerId, created: params.created,
        hasTitleImage: params.hasImage,
        creator: {
            name: name,
            slug: slug(name),
            userImage: await cdn.getSignedUrl(`profileImage/${userId}/thumbnail.jpg`),
            userImagePreview: await cdn.getSignedUrl(`profileImage/${userId}/profilePreview.jpg`),
            isLoggedInUser: true,
            isTrustUser: false
        }
    };
    if (!!params.answer) {
        response.answerHtml = linkifyHtml(params.answer, {attributes: {rel: 'noopener'}});
    }
    if (params.hasImage) {
        response.imageUrl = cdn.getPublicUrl(`defaultAnswer/${params.answerId}/500x800/title.jpg`);
    }
    return {created: response};
};

module.exports = {
    getResponse
};
