'use strict';

const responseHandler = require('./response');
const feedElementCounter = require('./feedElementCounter');
const filter = require('./filter');
const db = requireDb();
const PAGE_SIZE = 20;

const getTrustCircleAndTopicFilterDeactivated = function () {
    return db.cypher()
        .match(`(activityElement)-[relActivity:UP_VOTE|:WATCH|:IS_CREATOR|:EVENT]->(feedElement)`)
        .where(`feedElement.created <= {timestamp}`)
};

const getTrustCircleFilterWithDeactivatedTopicFilter = function (showInterested) {
    return db.cypher()
        .match(`(user:User {userId: {userId}})-[relWatch${showInterested ? ':WATCH|:' : ':'}IS_CONTACT]->(activityElement)
                 -[relActivity:UP_VOTE|:WATCH|:IS_CREATOR|:ANSWER|:EVENT]->(feedElement)`)
        .where(`feedElement.created <= {timestamp} AND NOT ((type(relActivity) = 'IS_CREATOR' OR 
                type(relActivity) = 'UP_VOTE') AND type(relWatch) = 'IS_CONTACT' AND 
                (user)-[:WATCH]->(:Question)-[:ANSWER]->(feedElement))`)
};

const getTopicFilterWithDeactivatedTrustCircleFilter = function (showInterested) {
    return db.cypher()
        .match(`(activityElement)-[relActivity:UP_VOTE|:WATCH|:IS_CREATOR|:EVENT]->(feedElement)`)
        .where(`feedElement.created <= {timestamp} AND NOT 
        ((type(relActivity) = 'UP_VOTE' OR type(relActivity) = 'WATCH') AND 
        (:User {userId: {userId}})-[relActivity]->(feedElement))`)
        .optionalMatch(`(feedElement)<-[:TOPIC]-(topic:Topic)`)
        .optionalMatch(`(feedElement)<-[:ANSWER|:EVENT]-(parent)<-[:TOPIC]-(parentTopic:Topic)`)
        .with(`activityElement, relActivity, feedElement, parent, topic, parentTopic`)
        .where(`topic.topicId IN {topics} OR parentTopic.topicId IN {topics} 
               ${showInterested ? 'OR (:User {userId: {userId}})-[:WATCH]->(parent)': ''}`)
        .with(`DISTINCT activityElement, relActivity, feedElement`)
};

const getTrustCircleAndTopicFilterActivated = function (showInterested) {
    return db.cypher()
        .match(`(user:User {userId: {userId}})-[relWatch${showInterested ? ':WATCH|:' : ':'}IS_CONTACT]->(activityElement)
                 -[relActivity:UP_VOTE|:WATCH|:IS_CREATOR|:ANSWER|:EVENT]->(feedElement)`)
        .where(`feedElement.created <= {timestamp} AND NOT ((type(relActivity) = 'IS_CREATOR' OR 
                type(relActivity) = 'UP_VOTE') AND type(relWatch) = 'IS_CONTACT' AND 
                (user)-[:WATCH]->(:Question)-[:ANSWER]->(feedElement))`)
        .optionalMatch(`(feedElement)<-[:TOPIC]-(topic:Topic)`)
        .optionalMatch(`(feedElement)<-[:ANSWER|:EVENT]-(parent)<-[:TOPIC]-(parentTopic:Topic)`)
        .with(`activityElement, relActivity, feedElement, parent, topic, parentTopic`)
        .where(`topic.topicId IN {topics} OR parentTopic.topicId IN {topics} 
               ${showInterested ? 'OR (:User {userId: {userId}})-[:WATCH]->(parent)': ''}`)
        .with(`DISTINCT activityElement, relActivity, feedElement`)
};

const getStartQuery = function (trustCircle, topics, showInterested) {
    if (!trustCircle && !topics) {
        return getTrustCircleAndTopicFilterDeactivated();
    } else if (trustCircle && !topics) {
        return getTrustCircleFilterWithDeactivatedTopicFilter(showInterested);
    } else if (!trustCircle && topics) {
        return getTopicFilterWithDeactivatedTrustCircleFilter(showInterested);
    } else {
        return getTrustCircleAndTopicFilterActivated(showInterested);
    }
};

const getFeed = async function (userId, page, timestamp, typeFilter, guiLanguage, languages, trustCircle, topics, regions,
                                showInterested) {
    page = page * PAGE_SIZE;
    let response = await getStartQuery(trustCircle, topics, showInterested)
        .optionalMatch(`(feedElement)-[:ANSWER]->(answer:Answer)`)
        .optionalMatch(`(feedElement)-[:BELONGS_TO_REGION]->(region:Region)`)
        .optionalMatch(`(feedElement)<-[:IS_CREATOR]-(creator:User)`)
        .optionalMatch(`(feedElement)<-[:ANSWER]-(question:Question)`)
        .optionalMatch(`(feedElement)-[:COMMITMENT]-(commitment:Commitment)-[:BELONGS_TO_REGION]->(rca:Region)`)
        .unwind(`[relActivity.created, feedElement.created] AS tempCreated`)
        .return(`DISTINCT feedElement, activityElement, creator, question, commitment, 
                 COUNT(DISTINCT answer) AS numberOfAnswers, collect(DISTINCT region.${guiLanguage}) AS regions, 
                 labels(feedElement) AS type, collect(DISTINCT rca.${guiLanguage}) AS commitmentAnswerRegions,
                 exists((creator)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS creatorIsInTrustCircle,
                 max(tempCreated) AS created, type(relActivity) AS relActivity`)
        .orderBy(`created DESC`)
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({userId, page, timestamp, topics})
        .send([feedElementCounter.getTotalNumberOfFeedElements(userId, timestamp, typeFilter)]);

    return {
        feed: await responseHandler.getFeed(response[1], userId),
        totalNumberOfElements: response[0][0].numberOfElements,
        timestamp
    };
};

module.exports = {
    getFeed
};
