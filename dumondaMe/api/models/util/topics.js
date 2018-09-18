const db = requireDb();

const changeTopicsCommand = function (bindTopicToEntity) {
    return db.cypher().match(`(topic:Topic)-[relTopic:TOPIC]->(${bindTopicToEntity})`)
        .delete(`relTopic`)
        .with(`DISTINCT ${bindTopicToEntity}`)
        .match(`(topic:Topic)`)
        .where(`topic.topicId IN {topics}`)
        .merge(`(topic)-[:TOPIC]->(${bindTopicToEntity})`)
        .getCommandString();
};

module.exports = {
    changeTopicsCommand
};
