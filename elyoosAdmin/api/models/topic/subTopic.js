'use strict';

const db = requireDb();


const getOrder = function (language) {
    if (language === 'de') {
        return "subTopic.de";
    }
    return "subTopic.en";
};

const getSubTopics = async function (topicId, language) {
    let resp = await db.cypher().match(`(topic:Topic {topicId: {topicId}})-[:SUB_TOPIC]->(subTopic:Topic)`)
        .optionalMatch(`(subTopic)-[:SUB_TOPIC]->(subSubTopic:Topic)`)
        .return(`subTopic.topicId AS topicId, count(subSubTopic) AS numberOfSubTopics,
                 subTopic.de AS de, subTopic.similarDe AS similarDe,
                 subTopic.en AS en, subTopic.similarEn AS similarEn`)
        .orderBy(getOrder(language)).end({topicId}).send();
    return {topics: resp};
};


module.exports = {
    getSubTopics,
};
