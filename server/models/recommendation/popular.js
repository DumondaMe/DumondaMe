'use strict';

var db = require('./../../neo4j');
var recommendationElements = require('./recommendationElement/recommendationElement');

var getPopularRecommendations = function (userId, params) {

    return db.cypher().match("(recommendation:Recommendation)-[:RECOMMENDS]->(recommendationElement)")
        .return(`COUNT(recommendationElement) AS numberOfRecommendations, MAX(recommendation.created) AS created, recommendationElement, 
                 LABELS(recommendationElement) AS pinwallType`)
        .orderBy("numberOfRecommendations DESC, created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end(params).send().then(function (resp) {
            return {recommendations: recommendationElements.getRecommendationElements(resp)};
        });
};

module.exports = {
    getPopularRecommendations: getPopularRecommendations
};
