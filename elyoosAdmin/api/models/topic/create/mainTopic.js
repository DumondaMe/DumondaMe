'use strict';

const db = requireDb();
const uuid = require('elyoos-server-lib').uuid;

const create = async function (params) {
    params.topicId = uuid.generateUUID();

    await db.cypher().create(`(:MainTopic:Topic {topicId: {topicId}, de: {de}, en: {en}, similarDe: {similarDe}, 
                                similarEn: {similarEn}})`)
        .end(params).send();

    return {topicId: params.topicId};
};


module.exports = {
    create,
};
