'use strict';

const db = requireDb();
const security = require('../security');
const youtube = require('../../../../util/youtube');
const time = require('elyoos-server-lib').time;
const exceptions = require('elyoos-server-lib').exceptions;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const ERROR_CODE_YOUTUBE_ID_NOT_FOUND = 1;

const editYoutubeAnswer = async function (userId, params) {
    await security.isAdmin(userId, params.answerId);
    let idOnYoutube = youtube.getYoutubeId(params.link);
    if (idOnYoutube) {
        await db.cypher()
            .match(`(answer:Youtube:Answer {answerId: {answerId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
            .set(`answer`, {
                title: params.title, description: params.description, idOnYoutube, link: params.link,
                linkEmbed: youtube.getEmbedUrl(params.link), modified: time.getNowUtcTimestamp()
            })
            .end({userId, answerId: params.answerId}).send();
        logger.info(`Edit book answer with id ${params.answerId}`)
    } else {
        throw new exceptions.InvalidOperation(`Id for youtube link ${params.link} not found`,
            ERROR_CODE_YOUTUBE_ID_NOT_FOUND);
    }
};

module.exports = {
    editYoutubeAnswer
};
