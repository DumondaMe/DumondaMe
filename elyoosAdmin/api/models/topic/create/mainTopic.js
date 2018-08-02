'use strict';

const db = requireDb();
const uuid = require('elyoos-server-lib').uuid;

const create = async function (params) {
    params.topicId = uuid.generateUUID();
    params.similarDe = params.similarDe || null;
    params.similarEn = params.similarEn || null;

    await db.cypher().create(`(:Topic {topicId: {topicId}, de: {de}, en: {en}, similarDe: {similarDe}, 
                                similarEn: {similarEn}})`)
        .end(params).send();

    return {topicId: params.topicId};
};


module.exports = {
    create,
};
