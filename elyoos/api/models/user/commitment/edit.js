'use strict';

const dashify = require('dashify');
const db = requireDb();
const image = require(`./image`);
const security = require('./security');
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const editCommitment = async function (userId, params, titlePath) {
    params.modified = time.getNowUtcTimestamp();
    params.userId = userId;
    params.website = params.website || null;
    await security.isAdmin(userId, params.answerId);
    await db.cypher()
        .match(`(commitment:Answer:Commitment {answerId: {answerId}})<-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .set(`commitment`, {
            title: params.title, description: params.description, website: params.website,
            language: params.lang, modified: params.modified
        })
        .end(params).send();

    await image.uploadTitleImage(titlePath, params.answerId, params.resetImage);
    logger.info(`Updated commitment with id ${params.answerId}`);

    return {slug: dashify(params.title)};
};

module.exports = {
    editCommitment
};
