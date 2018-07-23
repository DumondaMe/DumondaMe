'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const edit = async function (params, req) {

    params.similarDe = params.similarDe || [];
    params.similarEn = params.similarEn || [];

    let resp = await db.cypher().match(`(topic:Topic {topicId: {topicId}})`)
        .set(`topic`, {de: params.de, en: params.en, similarDe: params.similarDe, similarEn: params.similarEn})
        .return(`topic`)
        .end({topicId: params.topicId}).send();
    if (resp.length === 0) {
        return exceptions.getInvalidOperation(`topic ${params.topicId} does not exist`, logger, req);
    }
};


module.exports = {
    edit,
};
