'use strict';

const db = requireDb();
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const getTopicResponse = function (topics) {
    let map = {}, node, roots = [];
    for (let i = 0; i < topics.length; i++) {
        map[topics[i].topicId] = i;
        topics[i].subTopics = [];
        delete topics[i].isSubTopic;
    }

    for (let i = 0; i < topics.length; i++) {
        node = topics[i];
        if (node.parentTopicId) {
            topics[map[node.parentTopicId]].subTopics.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots;
};


const getTopics = async function (language) {

    let resp = await db.cypher().match(`(t:Topic)`)
        .optionalMatch(`(t)<-[:SUB_TOPIC]-(parentTopic:Topic)`)
        .return(`t.topicId AS topicId, t.${language} AS description, parentTopic.topicId AS parentTopicId,
                 exists(parentTopic.topicId) AS isSubTopic`)
        .orderBy(`isSubTopic DESC, description`)
        .end().send();

    logger.info(`Get all topics`);

    return {topics: getTopicResponse(resp)};
};

module.exports = {
    getTopics
};
