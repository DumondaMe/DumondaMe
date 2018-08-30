'use strict';

const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');
const cdn = require('elyoos-server-lib').cdn;
const time = require('elyoos-server-lib').time;
const db = requireDb();

const PAGE_SIZE = 20;
const FOUR_WEEKS = 2419200;
const WEEK = 604800;

const getFeedResponse = async function (questions) {
    for (let question of questions) {
        question.questionSlug = slug(question.question);
        if (question.description) {
            question.descriptionHtml = linkifyHtml(question.description);
        }
        question.user = {
            userId: question.creator.userId,
            name: question.creator.name,
            slug: slug(question.creator.name),
            userImage: await cdn.getSignedUrl(`profileImage/${question.creator.userId}/thumbnail.jpg`),
            userImagePreview: await cdn.getSignedUrl(`profileImage/${question.creator.userId}/profilePreview.jpg`),
            isLoggedInUser: question.isLoggedInUser,
            isTrustUser: question.isTrustUser
        };
        delete question.creator;
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

const getPeriodOfTimeFilterQuery = function (periodOfTime) {
    return db.cypher().with(`creator, question, answer, upVotes, watches`)
        .where(`upVotes.created > {${periodOfTime}} OR watches.created > {${periodOfTime}}`)
        .getCommandString();
};

const getPeriodOfTimeFilter = function (periodOfTime) {
    if (periodOfTime === 'week') {
        return getPeriodOfTimeFilterQuery('oneWeek');
    } else if (periodOfTime === 'month') {
        return getPeriodOfTimeFilterQuery('fourWeeks');
    }
    return '';
};

const getMostPopularQuery = function (trustCircle, topics, periodOfTime) {
    return db.cypher()
        .match(`(creator:User)-[:IS_CREATOR]->(question:Question)-[:ANSWER]->(answer:Answer)`)
        .where(`question.language IN {languages}`)
        .addCommand(getTopicFilter(topics, true))
        .optionalMatch(`(answer)<-[upVotes:UP_VOTE]-(:User)${getTrustCircleFilter(trustCircle)}`)
        .optionalMatch(`(question)<-[watches:WATCH]-(:User)${getTrustCircleFilter(trustCircle)}`)
        .addCommand(getPeriodOfTimeFilter(periodOfTime))
        .with(`creator, question, [count(DISTINCT upVotes), count(DISTINCT watches)] AS scoreList`)
        .with(`creator, question, reduce(totalScore = 0, n IN scoreList | totalScore + n) AS score`)
        .where(`score > 0`);
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
        .with(`creator, question, 0 AS score`)
};

const getStartQuery = function (order, trustCircle, topics, periodOfTime) {
    if (order === 'mostPopular') {
        return getMostPopularQuery(trustCircle, topics, periodOfTime);
    } else if (order === 'notAnswered') {
        return getOrderByTimeQuery(trustCircle, topics)
            .where(`NOT (question)-[:ANSWER]->(:Answer)`);
    } else if (order === 'onlyFewAnswers') {
        return getOrderByTimeQuery(trustCircle, topics)
            .optionalMatch(`(question)-[answer:ANSWER]-(:Answer)`)
            .with(`creator, question, score, count(DISTINCT answer) AS tempNumberOfAnswers`)
            .where(`tempNumberOfAnswers < 4`);
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
                 count(DISTINCT watches) AS numberOfWatches, score,
                 creator.userId = {userId} AS isLoggedInUser, 
                 EXISTS((creator)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isTrustUser`)
        .orderBy(`score DESC, created DESC`)
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({
            languages, userId, page, topics, fourWeeks: time.getNowUtcTimestamp() - FOUR_WEEKS,
            oneWeek: time.getNowUtcTimestamp() - WEEK
        }).send();

    return {
        feed: await getFeedResponse(response), timestamp
    };
};

module.exports = {
    getFeed
};
