'use strict';

let db = requireDb();
let recommendationElements = require('./recommendationElement/recommendationElement');

let getPopularPlaces = function (userId, params) {

    return db.cypher()
        .match(`(recommendationElement:Page {label:'Generic'})-[:HAS]->(address:Address)`)
        .where("toInt(distance(point(address),point({latitude: {centerLat}, longitude: {centerLng}})) / 1000) < {radius}")
        .with("DISTINCT recommendationElement")
        .optionalMatch("(recommender:User)-[:RECOMMENDS]->(recommendation:Recommendation)-[:RECOMMENDS]->(recommendationElement)")
        .with(`COUNT(recommendation) AS numberOfRecommendations, MAX(recommendation.created) AS created, recommendationElement,
               LABELS(recommendationElement) AS pinwallType`)
        .match(`(recommendationElement)-[:HAS]->(address:Address)`)
        .return(`numberOfRecommendations, created, recommendationElement, pinwallType, collect(address) AS addresses`)
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
