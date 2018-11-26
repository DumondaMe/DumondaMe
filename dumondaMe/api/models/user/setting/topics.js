'use strict';

let db = requireDb();

let changeTopicsSettings = async function (userId, topics) {
    if (topics && topics.length > 0) {
        await db.cypher().match(`(user:User {userId: {userId}})`)
            .optionalMatch(`(user)-[interested:INTERESTED]->(:Topic)`)
            .delete(`interested`)
            .with(`DISTINCT user`)
            .match(`(topic:Topic)`)
            .where(`topic.topicId IN {topics}`)
            .merge(`(user)-[:INTERESTED]->(topic)`)
            .end({userId, topics}).send();
    } else {
        await db.cypher().match(`(user:User {userId: {userId}})-[interested:INTERESTED]->(:Topic)`)
            .delete(`interested`)
            .end({userId, topics}).send();
    }
};

module.exports = {
    changeTopicsSettings
};
