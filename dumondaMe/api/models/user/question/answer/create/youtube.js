'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;
const time = require('dumonda-me-server-lib').time;
const cdn = require('dumonda-me-server-lib').cdn;
const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');
const youtube = require('../../../../util/youtube');
const notification = require(`./notification`);
const exceptions = require('dumonda-me-server-lib').exceptions;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const ERROR_CODE_YOUTUBE_ID_NOT_FOUND = 1;
const ERROR_CODE_YOUTUBE_EXISTS_ALREADY = 2;

const createYoutubeAnswerCommand = function (params) {
    return db.cypher().match(`(user:User {userId: {userId}}), 
                              (question:Question {questionId: {questionId}})`)
        .where(`NOT (question)-[:ANSWER]->(:Youtube {idOnYoutube: {idOnYoutube}})`)
        .create(`(answer:Youtube:Answer {answerId: {answerId}, idOnYoutube: {idOnYoutube}, title: {title}, 
                      description: {description}, link: {link}, linkEmbed: {embed}, created: {created}})`)
        .merge(`(user)-[:IS_CREATOR]->(answer)<-[:ANSWER]-(question)`)
        .return(`user.name AS name`)
        .end(params).getCommand();
};

const createYoutubeAnswerOriginalLinkCommand = function (params) {
    return db.cypher().match(`(original:Youtube {idOnYoutube: {idOnYoutube}})`)
        .where(`original.answerId <> {answerId}`)
        .with(`original, EXISTS((:Youtube)-[:ORIGINAL]->(original)) AS isOriginal`)
        .orderBy(`isOriginal DESC, original.created DESC`)
        .limit(1)
        .match(`(created:Youtube {answerId: {answerId}})`)
        .merge(`(created)-[:ORIGINAL]->(original)`)
        .end(params);
};

const createYoutubeAnswer = async function (userId, params) {
    params.answerId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    let idOnYoutube = youtube.getYoutubeId(params.link);
    if (idOnYoutube) {
        params.idOnYoutube = idOnYoutube;
        params.embed = youtube.getEmbedUrl(params.link);
        let user = await createYoutubeAnswerOriginalLinkCommand(params)
            .send([createYoutubeAnswerCommand(params),
                notification.addCreatedAnswerNotification(userId, params.answerId, params.created).getCommand()]);
        if (user[0].length === 1) {
            logger.info(`Created youtube answer ${params.answerId} for question ${params.questionId}`);
            let result = {
                answerId: params.answerId, created: params.created, idOnYoutube: params.idOnYoutube,
                creator: {
                    name: user[0][0].name,
                    slug: slug(user[0][0].name),
                    userImage: await cdn.getSignedUrl(`profileImage/${userId}/thumbnail.jpg`),
                    userImagePreview: await cdn.getSignedUrl(`profileImage/${userId}/profilePreview.jpg`),
                    isLoggedInUser: true,
                    isTrustUser: false
                }
            };
            if (typeof params.description === 'string') {
                result.descriptionHtml = linkifyHtml(params.description, {attributes: {rel: 'noopener'}});
            }
            return result;
        } else {
            throw new exceptions.InvalidOperation(`Youtube answer ${params.idOnYoutube} exists already for question 
            ${params.questionId}`, ERROR_CODE_YOUTUBE_EXISTS_ALREADY);
        }
    }
    throw new exceptions.InvalidOperation(`Id for youtube link ${params.link} not found`,
        ERROR_CODE_YOUTUBE_ID_NOT_FOUND);
};

module.exports = {
    createYoutubeAnswer
};
