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
    await security.isAdmin(userId, params.commitmentId);
    await db.cypher()
        .match(`(commitment:Commitment {commitmentId: {commitmentId}})<-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .set(`commitment`, {
            title: params.title, description: params.description, website: params.website,
            language: params.lang, modified: params.modified
        })
        .end(params).send();

    await image.uploadTitleImage(titlePath, params.commitmentId, params.resetImage);
    logger.info(`Updated commitment ${params.commitmentId}`);

    return {slug: dashify(params.title)};
};

module.exports = {
    editCommitment
};
