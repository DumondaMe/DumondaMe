const db = requireDb();

const normalizeTopic = function(topic) {
    let normalizedTopic = '';
    for (let word of topic.split(' ')) {
        if (word.length > 1) {
            normalizedTopic += word.charAt(0).toUpperCase() + word.slice(1) + ' '
        } else if (word.length === 1) {
            normalizedTopic += word.charAt(0).toUpperCase() + ' '
        }
    }
    return normalizedTopic.trim();
};

const normalizeTopics = function (topics) {
    for (let i = 0; i < topics.length; i++) {
        topics[i] = normalizeTopic(topics[i]);
    }
};

const changeTopicsCommand = function (bindTopicToEntity) {
    return db.cypher().foreach(`(topic IN {topics} | MERGE (:Topic {name: topic}))`)
        .with(`${bindTopicToEntity}`)
        .match(`(topic:Topic)`)
        .where(`topic.name IN {topics}`)
        .merge(`(topic)-[:TOPIC]->(${bindTopicToEntity})`)
        .with(`DISTINCT ${bindTopicToEntity}`)
        .match(`(topic:Topic)`)
        .where(`NOT topic.name IN {topics} AND (topic)-[:TOPIC]->(${bindTopicToEntity})`)
        .match(`(topic)-[relTopic:TOPIC]->(${bindTopicToEntity})`)
        .delete(`relTopic`)
        .with(`topic`)
        .where(`NOT EXISTS((topic)-[:TOPIC]->())`)
        .delete(`topic`)
        .getCommandString();
};

module.exports = {
    normalizeTopics,
    changeTopicsCommand
};
