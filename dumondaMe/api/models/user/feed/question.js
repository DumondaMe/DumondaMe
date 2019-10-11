'use strict';

const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');
const cdn = require('dumonda-me-server-lib').cdn;
const time = require('dumonda-me-server-lib').time;
const db = requireDb();

const PAGE_SIZE = 20;
const FOUR_WEEKS = 2419200;
const WEEK = 604800;

const getFeedResponse = async function (questions, userId) {
    for (let question of questions) {
        question.questionSlug = slug(question.question);
        if (question.description) {
            question.descriptionHtml = linkifyHtml(question.description, {attributes: {rel: 'noopener'}});
        }
        if (question.creator.privacyMode === 'public' || question.creator.userId === userId ||
            (question.creator.privacyMode === 'publicEl' && userId !== null) ||
            (question.creator.privacyMode === 'onlyContact' && question.creatorTrustUser)) {
            question.user = {
                isAnonymous: false,
                userId: question.creator.userId,
                name: question.creator.name,
                slug: slug(question.creator.name),
                userImage: await cdn.getSignedUrl(`profileImage/${question.creator.userId}/thumbnail.jpg`),
                userImagePreview: await cdn.getSignedUrl(`profileImage/${question.creator.userId}/profilePreview.jpg`),
                isLoggedInUser: question.isLoggedInUser,
                isTrustUser: question.isTrustUser,
                isHarvestingUser: question.isHarvestingUser
            };

        } else {
            question.user = {
                isAnonymous: true,
                userImage: await cdn.getSignedUrl(`profileImage/default/thumbnail.jpg`),
                userImagePreview: await cdn.getSignedUrl(`profileImage/default/profilePreview.jpg`)
            };
        }
        delete question.creator;
        delete question.creatorTrustUser;
    }
    return questions;
};

const getTrustCircleFilter = function (trustCircle) {
    if (trustCircle) {
        return `<-[:IS_CONTACT]-(:User {userId: {userId}})`
    }
    return '';
};

const getTopicFilter = function (topics, hasAnswer) {
    if (topics) {
        return db.cypher().optionalMatch(`(question)<-[:TOPIC]-(topic:Topic)`)
            .optionalMatch(`(topic)<-[:SUB_TOPIC*]-(nextTopic:Topic)`)
            .with(`creator, question, ${hasAnswer ? 'answer,' : ''} topic, collect(nextTopic) AS nextTopic`)
            .where(`topic.topicId IN {topics} OR ANY (t IN nextTopic WHERE t.topicId IN {topics})`)
            .getCommandString();
    }
    return ''
};

const getPeriodOfTimeActionsFilter = function (periodOfTime, type) {
    if (periodOfTime) {
        return db.cypher().where(`${type}.created > {${periodOfTime}}`).getCommandString();
    }
    return '';
};

const getPeriodOfTimeHasBeenWatchedFilter = function (periodOfTime) {
    if (periodOfTime) {
        return db.cypher().where(`scoreWatches > 0`).getCommandString();
    }
    return '';
};

const getMostPopularQuery = function (trustCircle, topics, periodOfTime) {
    return db.cypher()
        .match(`(creator:User)-[:IS_CREATOR]->(question:Question)`)
        .where(`question.language IN {languages}`)
        .optionalMatch(`(question)-[:ANSWER]->(answer:Answer)`)
        .addCommand(getTopicFilter(topics, true))
        .optionalMatch(`(answer)<-[upVotes:UP_VOTE]-(:User)${getTrustCircleFilter(trustCircle)}`)
        .addCommand(getPeriodOfTimeActionsFilter(periodOfTime, 'upVotes'))
        .optionalMatch(`(question)<-[watches:WATCH]-(:User)${getTrustCircleFilter(trustCircle)}`)
        .addCommand(getPeriodOfTimeActionsFilter(periodOfTime, 'watches'))
        .with(`creator, question, count(DISTINCT upVotes) AS scoreUpVotes, count(DISTINCT watches) AS scoreWatches`)
        .addCommand(getPeriodOfTimeHasBeenWatchedFilter(periodOfTime))
};

const getTrustCircleFilterForNewest = function (trustCircle) {
    if (trustCircle) {
        return `AND (creator)<-[:IS_CONTACT]-(:User {userId: {userId}})`
    }
    return '';
};

const getOrderByTimeQuery = function (trustCircle, topics) {
    return db.cypher()
        .match(`(creator:User)-[:IS_CREATOR]->(question:Question)`)
        .where(`question.language IN {languages}${getTrustCircleFilterForNewest(trustCircle)}`)
        .addCommand(getTopicFilter(topics, false))
        .with(`creator, question, 0 AS scoreUpVotes, 0 AS scoreWatches`)
};

const getStartQuery = function (order, trustCircle, topics, periodOfTime) {
    if (order === 'mostPopular') {
        return getMostPopularQuery(trustCircle, topics, periodOfTime);
    } else if (order === 'notAnswered') {
        return getOrderByTimeQuery(trustCircle, topics)
            .where(`NOT (question)-[:ANSWER]->(:Answer)`);
    }
    return getOrderByTimeQuery(trustCircle, topics);
};

const getFeed = async function (userId, page, timestamp, order, periodOfTime, guiLanguage, languages, trustCircle,
                                topics) {
    page = page * PAGE_SIZE;

    let response = await getStartQuery(order, trustCircle, topics, periodOfTime)
        .optionalMatch(`(question)<-[watches:WATCH]-(:User)`)
        .optionalMatch(`(question)-[answer:ANSWER]-(:Answer)`)
        .return(`creator, question.questionId AS questionId, question.question AS question, question.created AS created,
                 question.description AS description, count(DISTINCT answer) AS numberOfAnswers, 'Question' AS type,
                 count(DISTINCT watches) AS numberOfWatches, scoreWatches, scoreUpVotes,
                 creator.userId = {userId} AS isLoggedInUser, 
                 EXISTS((creator)-[:IS_CONTACT]->(:User {userId: {userId}})) AS creatorTrustUser,
                 EXISTS((creator)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isTrustUser,
                 EXISTS((question)<-[:WATCH]-(:User {userId: {userId}})) AS isWatchedByUser,
                 EXISTS((question)<-[:IS_CREATOR]-(:User {userId: {userId}})) AS isAdmin,
                 ANY (label IN LABELS(creator) WHERE label = 'HarvestingUser') AS isHarvestingUser`)
        .orderBy(`scoreWatches DESC, scoreUpVotes DESC, created DESC`)
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({
            languages, userId, page, topics, month: time.getNowUtcTimestamp() - FOUR_WEEKS,
            week: time.getNowUtcTimestamp() - WEEK
        }).send();

    return {
        feed: await getFeedResponse(response, userId), timestamp
    };
};

module.exports = {
    getFeed
};
