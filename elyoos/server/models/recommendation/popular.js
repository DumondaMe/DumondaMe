'use strict';

var db = requireDb();
var time = requireLib('time');
var recommendationElements = require('./recommendationElement/recommendationElement');

var twoWeeksConstant = 1209600;

var getLanguageFilter = function (language) {
    if (language) {
        return "ANY(l IN recommendationElement.language WHERE l IN {language})";
    }
    return null;
};

var getPeriodFilter = function (period) {
    if (period === 'twoWeeks') {
        return "recommendation.created > {twoWeeks}";
    }
    return null;
};

var getTopicFilter = function (topic) {
    if (topic) {
        return "ANY(l IN recommendationElement.topic WHERE l IN {topic})";
    }
    return null;
};

var getRecommendationTypeFilter = function (recommendationType) {
    if (recommendationType) {
        return `(ANY(l IN LABELS(recommendationElement) WHERE l IN {recommendationType}) OR 
                 ANY(r IN {recommendationType} WHERE r = recommendationElement.label))`;
    }
    return null;
};

var getIgnoreBlockedContacts = function () {
    return "NOT EXISTS((user)-[:IS_BLOCKED]->(recommender))";
};

var getFilters = function (params) {
    return db.concatCommandsWithAnd([getLanguageFilter(params.language), getIgnoreBlockedContacts(),
        getPeriodFilter(params.period), getTopicFilter(params.topic), getRecommendationTypeFilter(params.recommendationType)]);
};

var getOnlyContacts = function (params) {
    if (params.onlyContact) {
        return "(:User {userId: {userId}})-[:IS_CONTACT]->";
    }
    return "";
};

var getPopularRecommendations = function (userId, params) {

    var whereCondition = getFilters(params);
    params.userId = userId;
    params.twoWeeks = time.getNowUtcTimestamp() - twoWeeksConstant;

    return db.cypher()
        .match(getOnlyContacts(params) + `(recommender:User)-[:RECOMMENDS]->(recommendation:Recommendation)-[:RECOMMENDS]->(recommendationElement), 
        (user:User {userId: {userId}})`)
        .where(whereCondition)
        .optionalMatch("(recommendationElement)<-[:WRITTEN]-(writer)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(writer)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("relPrivacy.type = isContact.type")
        .optionalMatch("(writer)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .optionalMatch("(writer)-[writerBlockedUser:IS_BLOCKED]->(user)")
        .return(`COUNT(recommendationElement) AS numberOfRecommendations, MAX(recommendation.created) AS created, recommendationElement, writer,
                 LABELS(recommendationElement) AS pinwallType, privacy, privacyNoContact, writerBlockedUser`)
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
