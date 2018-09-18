'use strict';

const user = require('../register/overview');
const news = require('../news/overview');
const topicSuggestion = require('../topic/suggestion');
const region = require('../region/regions');

const getRegionsResponse = function (regions) {
    let response = [];
    for (let region of regions) {
        response.push({region: region.region.de});
    }
    return response;
};

const getOverview = async function () {

    let commands = [];
    let params = {skip: 0, maxItems: 10};

    commands.push(user.getOverviewOfUser(params).getCommand());
    commands.push(user.getNumberOfUser().getCommand());
    commands.push(topicSuggestion.getNumberOfTopicSuggestions().getCommand());
    commands.push(topicSuggestion.getTopicSuggestions(params.skip, params.maxItems).getCommand());
    commands.push(region.getRegionsCommand('de', 'international').getCommand());

    let resp = await news.getOverviewCommand(params).send(commands);
    return {
        numberOfUsers: resp[1][0].numberOfUser, users: await user.getUserResponse(resp[0]),
        numberOfTopicSuggestions: resp[2][0].numberOfSuggestion,
        topicSuggestions: await topicSuggestion.getTopicSuggestionResponse(resp[3]),
        regions: getRegionsResponse(resp[4]),
        news: resp[5]
    };
};

module.exports = {
    getOverview
};
