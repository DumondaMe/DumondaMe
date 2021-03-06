'use strict';

const slug = require('limax');
const db = requireDb();
const titleImage = require(`./image`);
const image = require('dumonda-me-server-lib').image;
const security = require('./security');
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const editCommitment = async function (userId, params, titlePath) {
    params.modified = time.getNowUtcTimestamp();
    params.userId = userId;
    params.website = params.website || null;
    await security.isAdmin(userId, params.commitmentId);
    await image.checkImageMinWidth(titlePath, 460);
    await db.cypher()
        .match(`(commitment:Commitment {commitmentId: {commitmentId}})<-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .set(`commitment`, {
            title: params.title, description: params.description, website: params.website,
            language: params.lang, modified: params.modified
        })
        .end(params).send();

    await titleImage.uploadTitleImage(titlePath, params.commitmentId, params.resetImage);
    logger.info(`Updated commitment ${params.commitmentId}`);

    return {slug: slug(params.title)};
};

module.exports = {
    editCommitment
};
