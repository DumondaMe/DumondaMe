'use strict';

var db = requireDb();
var recommendationElements = require('./recommendationElement/recommendationElement');

var getPopularPlaces = function (userId, params) {

    return db.cypher()
        .match(`(recommendationElement:Page {label:'Generic'})-[:HAS]->(address:Address)`)
        .where("toInt(distance(point(address),point({latitude: {centerLat}, longitude: {centerLng}})) / 1000) < {radius}")
        .optionalMatch("(recommender:User)-[:RECOMMENDS]->(recommendation:Recommendation)-[:RECOMMENDS]->(recommendationElement)")
        .with(`COUNT(recommendation) AS numberOfRecommendations, MAX(recommendation.created) AS created, recommendationElement,
               LABELS(recommendationElement) AS pinwallType`)
        .match(`(recommendationElement)-[:HAS]->(address:Address)`)
        .return(`numberOfRecommendations, created, recommendationElement, pinwallType, collect(address) AS places`)
        .orderBy("numberOfRecommendations DESC, created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end(params).send().then(function (resp) {
            return {recommendations: recommendationElements.getRecommendationElements(resp)};
        });
};

module.exports = {
    getPopularPlaces: getPopularPlaces
};
