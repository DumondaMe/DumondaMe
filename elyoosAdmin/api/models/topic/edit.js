'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const checkTopicsExist = async function (topicId, parentTopicId, req) {
    parentTopicId = parentTopicId || null;

    let commands = [db.cypher().match(`(topic:Topic {topicId: {parentTopicId}})`)
        .return(`topic`).end({parentTopicId}).getCommand()];
    let resp = await db.cypher().match(`(topic:Topic {topicId: {topicId}})`)
        .return(`topic`).end({topicId}).send(commands);
    if (resp[1].length === 0) {
        return exceptions.getInvalidOperation(`topic ${topicId} does not exist`, logger, req);
    } else if (parentTopicId && resp[0].length === 0) {
        return exceptions.getInvalidOperation(`Parent topic ${parentTopicId} does not exist`, logger, req);
    }
};

const edit = async function (params, req) {

    params.similarDe = params.similarDe || [];
    params.similarEn = params.similarEn || [];

    await checkTopicsExist(params.topicId, params.parentTopicId, req);
    if (params.parentTopicId) {
        await db.cypher().match(`(topic:Topic {topicId: {topicId}})`)
            .set(`topic`, {de: params.de, en: params.en, similarDe: params.similarDe, similarEn: params.similarEn})
            .with(`topic`)
            .optionalMatch(`(topic)<-[relSubTopic:SUB_TOPIC]-(:Topic)`)
            .delete(`relSubTopic`)
            .with(`topic`)
            .match(`(parentTopic:Topic {topicId: {parentTopicId}})`)
            .merge(`(topic)<-[:SUB_TOPIC]-(parentTopic)`)
            .end({topicId: params.topicId, parentTopicId: params.parentTopicId}).send();
    } else {
        await db.cypher().match(`(topic:Topic {topicId: {topicId}})`)
            .optionalMatch(`(topic)<-[relSubTopic:SUB_TOPIC]-(:Topic)`)
            .set(`topic`, {de: params.de, en: params.en, similarDe: params.similarDe, similarEn: params.similarEn})
            .delete(`relSubTopic`)
            .end({topicId: params.topicId}).send();
    }
};


module.exports = {
    edit,
};
