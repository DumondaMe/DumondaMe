'use strict';

const db = requireDb();

const numberOfMainTopics = function () {
    return db.cypher().match(`(mainTopic:Topic)`)
        .where(`NOT (mainTopic)<-[:SUB_TOPIC]-(:Topic)`)
        .return(`count(*) AS numberOfMainTopics`);
};

const getOrder = function (language) {
    if (language === 'de') {
        return "mainTopic.de";
    }
    return "mainTopic.en";
};

const getMainTopics = function (skip, maxItems, language) {
    return db.cypher().match(`(mainTopic:Topic)`)
        .where(`NOT (mainTopic)<-[:SUB_TOPIC]-(:Topic)`)
        .optionalMatch(`(mainTopic)-[:SUB_TOPIC]->(topic:Topic)`)
        .return(`mainTopic.topicId AS topicId, count(topic) AS numberOfSubTopics,
                 mainTopic.de AS de, mainTopic.similarDe AS similarDe,
                 mainTopic.en AS en, mainTopic.similarEn AS similarEn`)
        .orderBy(getOrder(language))
        .skip("{skip}").limit("{maxItems}").end({skip, maxItems});
};


module.exports = {
    numberOfMainTopics,
    getMainTopics,
};
