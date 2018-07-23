'use strict';

const topicSuggestion = require('./suggestion');
const topic = require('./topic');

const getOverview = async function (params) {

    let commands = [];

    commands.push(topicSuggestion.getTopicSuggestions(params.skip, params.maxItems).getCommand());
    commands.push(topicSuggestion.getNumberOfTopicSuggestions().getCommand());

    commands.push(topic.getMainTopics(params.skip, params.maxItems, params.language).getCommand());

    let resp = await topic.numberOfMainTopics().send(commands);
    return {
        topicSuggestions: await topicSuggestion.getTopicSuggestionResponse(resp[0]),
        numberOfTopicSuggestions: resp[1][0].numberOfSuggestion, topics: resp[2],
        numberOfTopics: resp[3][0].numberOfMainTopics
    };
};

module.exports = {
    getOverview
};
