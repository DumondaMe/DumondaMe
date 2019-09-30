'use strict';

const db = requireDb();
const cdn = require('dumonda-me-server-lib').cdn;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const getTopicResponse = function (topics) {
    let map = {}, node, roots = [];
    for (let i = 0; i < topics.length; i++) {
        map[topics[i].id] = i;
        topics[i].image = cdn.getPublicUrl(`topic/${topics[i].id}/preview.jpg`);
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

const mainTopicFilter = function (onlyMainTopics) {
    if(onlyMainTopics) {
        return `NOT (t)<-[:SUB_TOPIC]-(:Topic)`;
    }
    return ``;
};

const getTopics = async function (language, onlyMainTopics) {

    let resp = await db.cypher().match(`(t:Topic)`)
        .where(mainTopicFilter(onlyMainTopics))
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
