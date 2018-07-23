'use strict';

const db = requireDb();
const cdn = require('elyoos-server-lib').cdn;

const getNumberOfTopicSuggestions = function () {
    return db.cypher().match(`(user:User)-[:SUGGEST]->(suggestion:TopicSuggestion)`)
        .return("count(*) AS numberOfSuggestion").end();
};

const getTopicSuggestions = function (skip, maxItems) {
    return db.cypher().match(`(user:User)-[:SUGGEST]->(suggestion:TopicSuggestion)`)
        .return("user.userId AS userId, user.name AS name, suggestion.created AS created, suggestion.topic AS topic")
        .orderBy("created DESC")
        .skip("{skip}").limit("{maxItems}").end({skip, maxItems});
};

const getTopicSuggestionResponse = async function (suggestions) {
    let formattedUsers = [];
    for (let suggestion of suggestions) {
        let formattedSuggestion = {};
        formattedSuggestion.userId = suggestion.userId;
        formattedSuggestion.name = suggestion.name;
        formattedSuggestion.created = suggestion.created;
        formattedSuggestion.topic = suggestion.topic;
        formattedSuggestion.url = await cdn.getSignedUrl(`profileImage/${suggestion.userId}/thumbnail.jpg`);
        formattedUsers.push(formattedSuggestion);
    }
    return formattedUsers;
};


module.exports = {
    getTopicSuggestions,
    getNumberOfTopicSuggestions,
    getTopicSuggestionResponse
};
