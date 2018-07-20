'use strict';

const user = require('../register/overview');
const news = require('../news/overview');
const topicSuggestion = require('../topic/suggestion');

const getOverview = async function () {

    let commands = [];
    let params = {skip: 0, maxItems: 10};

    commands.push(user.getOverviewOfUser(params).getCommand());
    commands.push(user.getNumberOfUser().getCommand());
    commands.push(topicSuggestion.getNumberOfTopicSuggestions().getCommand());
    commands.push(topicSuggestion.getTopicSuggestions(params).getCommand());

    let resp = await news.getOverviewCommand(params).send(commands);
    return {
        numberOfUsers: resp[1][0].numberOfUser, users: await user.getUserResponse(resp[0]),
        numberOfTopicSuggestions: resp[2][0].numberOfSuggestion,
        topicSuggestions: await topicSuggestion.getTopicSuggestionResponse(resp[3]),
        news: resp[4]
    };
};

module.exports = {
    getOverview
};
