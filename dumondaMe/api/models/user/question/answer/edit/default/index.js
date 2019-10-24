'use strict';

const db = requireDb();
const linkifyHtml = require('linkifyjs/html');
const security = require('../../security');
const image = require('../../create/default/image');
const time = require('dumonda-me-server-lib').time;
const exceptions = require('dumonda-me-server-lib').exceptions;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const hasImageLabelIsRequired = function (answer) {
    if (answer === null) {
        return ':HasTitleImage'
    }
    return ''
};

const getResponse = function (answer) {
    if (typeof answer === 'string') {
        return {answerHtml: linkifyHtml(answer, {attributes: {rel: 'noopener'}})}
    }
    return {answerHtml: ''}
};

const editAnswer = async function (userId, params) {
    params.userId = userId;
    params.answer = params.answer || null;
    await security.isAdmin(userId, params.answerId);

    let resp = await db.cypher()
        .match(`(answer:Default:Answer${hasImageLabelIsRequired(params.answer)} {answerId: {answerId}})` +
            `<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`answer`, {answer: params.answer, modified: time.getNowUtcTimestamp()})
        .return(`answer`)
        .end(params).send();
    if (resp.length === 1) {
        logger.info(`Edit default answer with id ${params.answerId}`);
        return getResponse(params.answer);
    }
    throw new exceptions.InvalidOperation(`Answer ${params.answerId} could not be changed`);
};

const changeImage = async function (userId, answerId, titleImage, req) {
    await security.isAdmin(userId, answerId);
    await image.checkImageMinWidth(titleImage, 1000, req);
    await image.uploadImages(titleImage, answerId);
    await db.cypher().match(`(answer:Default {answerId: {answerId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`answer`, {modified: time.getNowUtcTimestamp()})
        .addCommand(` SET answer:HasTitleImage`)
        .end({userId, answerId}).send();
};

module.exports = {
    editAnswer,
    changeImage
};
