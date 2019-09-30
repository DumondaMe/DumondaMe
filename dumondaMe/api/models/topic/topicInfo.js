'use strict';

const db = requireDb();
const cdn = require('dumonda-me-server-lib').cdn;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const getTopicInfoResponse = function (dbTopics) {
    let topics = [];
    for(let topic of dbTopics) {
        topics.push({
            id: topic.id, description: topic.description,
            image: cdn.getPublicUrl(`topic/${topic.id}/preview.jpg`),
            thumbnail: cdn.getPublicUrl(`topic/${topic.id}/thumbnail.jpg`)
        })
    }
    return topics;
};

const getTopicsInfos = async function (language, topicIds) {

    let resp = await db.cypher().match(`(t:Topic)`)
        .where(`t.topicId in {topicIds}`)
        .return(`t.topicId AS id, t.${language} AS description`)
        .orderBy(`description`)
        .end({topicIds}).send();

    logger.info(`Get topic info for ${topicIds}`);

    return getTopicInfoResponse(resp);
};

module.exports = {
    getTopicsInfos
};
