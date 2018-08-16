'use strict';

const responseHandler = require('./response');
const db = requireDb();
const PAGE_SIZE = 20;

const onlyLatestUpVoteOrWatch = function () {
    return db.cypher().unwind(`[relActivity.created, feedElement.created] AS tempCreated`)
        .with(`type(relActivity) AS activity, feedElement, max(tempCreated) AS created`)
        .match(`(activityElement)-[relActivity:UP_VOTE|:WATCH|:IS_CREATOR|:ANSWER|:EVENT]->(feedElement)`)
        .where(`type(relActivity) = activity AND 
               (((activity = 'UP_VOTE' OR activity = 'WATCH') AND relActivity.created = created) OR 
               ((activity = 'IS_CREATOR' OR activity = 'EVENT' OR activity = 'ANSWER') 
                 AND feedElement.created = created))`)
        .getCommandString();
};

const getTypeFilter = function (typeFilter) {
    if (typeFilter && typeFilter === 'Video') {
        return `AND feedElement:Youtube`;
    } else if (typeFilter && typeFilter === 'Commitment') {
        return `AND (feedElement:Commitment OR feedElement:CommitmentAnswer)`;
    } else if (typeFilter && typeFilter !== 'Video') {
        return `AND feedElement:${typeFilter}`;
    }
    return '';
};

const topicFilter = function (topics, showInterested) {
    if (topics) {
        return db.cypher().optionalMatch(`(feedElement)<-[:TOPIC]-(topic:Topic)`)
            .optionalMatch(`(topic)<-[:SUB_TOPIC*]-(nextTopic:Topic)`)
            .optionalMatch(`(feedElement)<-[:ANSWER|:EVENT]-(parent)<-[:TOPIC]-(parentTopic:Topic)`)
            .optionalMatch(`(parentTopic)<-[:SUB_TOPIC*]-(nextParentTopic:Topic)`)
            .with(`DISTINCT activityElement, relActivity, feedElement, parent, topic, collect(nextTopic) AS nextTopic, 
               parentTopic, collect(nextParentTopic) AS nextParentTopic`)
            .where(`topic.topicId IN {topics} OR parentTopic.topicId IN {topics} OR 
                ANY (t IN nextTopic WHERE t.topicId IN {topics}) OR 
                ANY (t IN nextParentTopic WHERE t.topicId IN {topics}) 
               ${showInterested ? 'OR (:User {userId: {userId}})-[:WATCH]->(parent)' : ''}`)
            .with(`DISTINCT activityElement, relActivity, feedElement`)
            .getCommandString();
    }
    return '';
};

const regionFilter = function (regions) {
    if (regions) {
        return db.cypher().optionalMatch(`(feedElement)-[:BELONGS_TO_REGION]->(region:Region)`)
            .optionalMatch(`(region)<-[:SUB_REGION*]-(nextRegion:Region)`)
            .optionalMatch(`(feedElement)-[:COMMITMENT]->(:Commitment)-[:BELONGS_TO_REGION]->(commitmentRegion:Region)`)
            .optionalMatch(`(commitmentRegion)<-[:SUB_REGION*]-(nextParentRegion:Region)`)
            .with(`DISTINCT activityElement, relActivity, feedElement, region, collect(nextRegion) AS nextRegion,
                   commitmentRegion, collect(nextParentRegion) AS nextParentRegion`)
            .where(`NOT (feedElement:Event OR feedElement:Commitment OR feedElement:CommitmentAnswer) OR 
                    region.regionId IN {regions} OR ANY (r IN nextRegion WHERE r.regionId IN {regions}) OR
                    commitmentRegion.regionId IN {regions} OR ANY (r IN nextParentRegion WHERE r.regionId IN {regions})`)
            .with(`DISTINCT activityElement, relActivity, feedElement`)
            .getCommandString();
    }
    return '';
};

const onlyUpcomingEvents = function () {
    return `AND NOT (type(relActivity) = 'EVENT' AND feedElement:Event AND feedElement.endDate < {timestamp})`
};

const getTrustCircleAndTopicFilterDeactivated = function (typeFilter) {
    return db.cypher()
        .match(`(activityElement)-[relActivity:UP_VOTE|:WATCH|:IS_CREATOR|:EVENT]->(feedElement)`)
        .where(`feedElement.created <= {timestamp} ${onlyUpcomingEvents()} ${getTypeFilter(typeFilter)}`)
        .addCommand(onlyLatestUpVoteOrWatch())
};

const getTrustCircleFilterWithDeactivatedTopicFilter = function (typeFilter, showInterested) {
    return db.cypher()
        .match(`(user:User {userId: {userId}})-[relWatch${showInterested ? ':WATCH|:' : ':'}IS_CONTACT]->(activityElement)
                 -[relActivity:UP_VOTE|:WATCH|:IS_CREATOR|:ANSWER|:EVENT]->(feedElement)`)
        .where(`feedElement.created <= {timestamp} AND NOT ((type(relActivity) = 'IS_CREATOR' OR 
                type(relActivity) = 'UP_VOTE') AND type(relWatch) = 'IS_CONTACT' AND 
                (user)-[:WATCH]->(:Question)-[:ANSWER]->(feedElement)) ${onlyUpcomingEvents()} 
                ${getTypeFilter(typeFilter)}`)
        .addCommand(onlyLatestUpVoteOrWatch())
};

const getTopicFilterWithDeactivatedTrustCircleFilter = function (typeFilter, topics, showInterested) {
    return db.cypher()
        .match(`(activityElement)-[relActivity:UP_VOTE|:WATCH|:IS_CREATOR|:EVENT]
                 ->(feedElement)`)
        .where(`feedElement.created <= {timestamp} AND NOT 
        ((type(relActivity) = 'UP_VOTE' OR type(relActivity) = 'WATCH') AND 
        (:User {userId: {userId}})-[relActivity]->(feedElement)) ${onlyUpcomingEvents()} ${getTypeFilter(typeFilter)}`)
        .addCommand(onlyLatestUpVoteOrWatch())
        .addCommand(topicFilter(topics, showInterested))
};

const getTrustCircleAndTopicFilterActivated = function (typeFilter, topics, showInterested) {
    return db.cypher()
        .match(`(user:User {userId: {userId}})-[relWatch${showInterested ? ':WATCH|:' : ':'}IS_CONTACT]->(activityElement)
                 -[relActivity:UP_VOTE|:WATCH|:IS_CREATOR|:ANSWER|:EVENT]->(feedElement)`)
        .where(`feedElement.created <= {timestamp} AND NOT ((type(relActivity) = 'IS_CREATOR' OR 
                type(relActivity) = 'UP_VOTE') AND type(relWatch) = 'IS_CONTACT' AND 
                (user)-[:WATCH]->(:Question)-[:ANSWER]->(feedElement)) ${onlyUpcomingEvents()} 
                ${getTypeFilter(typeFilter)}`)
        .addCommand(onlyLatestUpVoteOrWatch())
        .addCommand(topicFilter(topics, showInterested))
};

const getStartQuery = function (trustCircle, topics, typeFilter, showInterested) {
    if (!trustCircle && !topics) {
        return getTrustCircleAndTopicFilterDeactivated(typeFilter);
    } else if (trustCircle && !topics) {
        return getTrustCircleFilterWithDeactivatedTopicFilter(typeFilter, showInterested);
    } else if (!trustCircle && topics) {
        return getTopicFilterWithDeactivatedTrustCircleFilter(typeFilter, topics, showInterested);
    } else {
        return getTrustCircleAndTopicFilterActivated(typeFilter, topics, showInterested);
    }
};

const getFeed = async function (userId, page, timestamp, typeFilter, guiLanguage, languages, trustCircle, topics,
                                regions, showInterested) {
    page = page * PAGE_SIZE;
    regions = regions || null;
    let response = await getStartQuery(trustCircle, topics, typeFilter, showInterested)
        .addCommand(regionFilter(regions))
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
                 exists((activityElement)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS activityIsInTrustCircle,
                 max(tempCreated) AS created, type(relActivity) AS relActivity`)
        .orderBy(`created DESC`)
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({userId, page, timestamp, topics, regions}).send();

    return {
        feed: await responseHandler.getFeed(response, userId), timestamp
    };
};

module.exports = {
    getFeed
};
