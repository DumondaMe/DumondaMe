'use strict';

const db = requireDb();
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const getTopicResponse = function (topics) {
    let map = {}, node, roots = [];
    for (let i = 0; i < topics.length; i++) {
        map[topics[i].id] = i;
        topics[i].subItems = [];
        delete topics[i].isSubItem;
    }

    for (let i = 0; i < topics.length; i++) {
        node = topics[i];
        if (node.parentId) {
            topics[map[node.parentId]].subItems.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots;
};


const getTopics = async function (language) {

    let resp = await db.cypher().match(`(t:Topic)`)
        .optionalMatch(`(t)<-[:SUB_TOPIC]-(parentTopic:Topic)`)
        .return(`t.topicId AS id, t.${language} AS description, parentTopic.topicId AS parentId,
                 exists(parentTopic.topicId) AS isSubItem`)
        .orderBy(`isSubItem DESC, description`)
        .end().send();

    logger.info(`Get all topics`);

    return getTopicResponse(resp);
};

module.exports = {
    getTopics
};
