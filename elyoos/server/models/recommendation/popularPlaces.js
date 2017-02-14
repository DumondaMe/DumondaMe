'use strict';

let db = requireDb();
let cdn = require('elyoos-server-lib').cdn;

let compare = function (a, b) {
    if (a.addressId < b.addressId) {
        return -1;
    } else if (a.addressId > b.addressId) {
        return 1;
    }
    return 0;
};

let getRecommendationElements = function (pinwallElements) {
    let elements = [];
    pinwallElements.forEach(function (pinwallElement) {
        let element = {};
        element.label = 'Generic';
        element.pageId = pinwallElement.recommendationElement.pageId;
        element.title = pinwallElement.recommendationElement.title;
        element.topic = pinwallElement.recommendationElement.topic;
        element.url = cdn.getUrl(`pages/${element.pageId}/thumbnail.jpg`);
        element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
        if (pinwallElement.hasOwnProperty("addresses")) {
            element.addresses = pinwallElement.addresses;
            element.addresses.sort(compare);
        }
        elements.push(element);
    });
    return elements;
};

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
            return {recommendations: getRecommendationElements(resp)};
        });
};

module.exports = {
    getPopularPlaces: getPopularPlaces
};
