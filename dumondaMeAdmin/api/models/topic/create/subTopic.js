'use strict';

const db = requireDb();
const uuid = require('elyoos-server-lib').uuid;

const create = async function (params) {
    params.topicId = uuid.generateUUID();
    params.similarDe = params.similarDe || null;
    params.similarEn = params.similarEn || null;

    await db.cypher().match(`(parentTopic:Topic {topicId: {parentTopicId}})`)
        .create(`(topic:Topic {topicId: {topicId}, de: {de}, en: {en}, similarDe: {similarDe}, 
                                similarEn: {similarEn}})`)
        .merge(`(topic)<-[:SUB_TOPIC]-(parentTopic)`)
        .end(params).send();

    return {topicId: params.topicId};
};


module.exports = {
    create,
};
