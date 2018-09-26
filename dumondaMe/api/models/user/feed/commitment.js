'use strict';

const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');
const cdn = require('dumonda-me-server-lib').cdn;
const time = require('dumonda-me-server-lib').time;
const db = requireDb();

const PAGE_SIZE = 20;
const FOUR_WEEKS = 2419200;
const WEEK = 604800;

const getFeedResponse = async function (commitments) {
    for (let commitment of commitments) {
        commitment.commitmentSlug = slug(commitment.title);
        commitment.imageUrl = cdn.getPublicUrl(`commitment/${commitment.commitmentId}/460x460/title.jpg`);
        if (commitment.modified) {
            commitment.imageUrl = commitment.imageUrl + `?v=${commitment.modified}`
        }
        if (commitment.description) {
            commitment.descriptionHtml = linkifyHtml(commitment.description);
        }
        if (commitment.creator.privacyMode === 'public' ||
            (commitment.creator.privacyMode === 'publicEl' && userId !== null) ||
            (commitment.creator.privacyMode === 'onlyContact' && commitment.creatorTrustUser)) {
            commitment.user = {
                isAnonymous: false,
                userId: commitment.creator.userId,
                name: commitment.creator.name,
                slug: slug(commitment.creator.name),
                userImage: await cdn.getSignedUrl(`profileImage/${commitment.creator.userId}/thumbnail.jpg`),
                userImagePreview: await cdn.getSignedUrl(`profileImage/${commitment.creator.userId}/profilePreview.jpg`),
                isLoggedInUser: commitment.isLoggedInUser,
                isTrustUser: commitment.isTrustUser
            };
        } else {
            commitment.user = {
                isAnonymous: true,
                userImage: await cdn.getSignedUrl(`profileImage/default/thumbnail.jpg`),
                userImagePreview: await cdn.getSignedUrl(`profileImage/default/profilePreview.jpg`)
            };
        }
        delete commitment.creator;
        delete commitment.creatorTrustUser;
    }
    return commitments;
};

const getTrustCircleFilter = function (trustCircle) {
    let query = db.cypher().optionalMatch(`(commitment)<-[watches:WATCH]-(watcher:User)`);
    if (trustCircle) {
        query.with(`creator, commitment, watches, watcher`)
            .where(`(creator)<-[:IS_CONTACT]-(:User {userId: {userId}}) OR 
                    (watcher)<-[:IS_CONTACT]-(:User {userId: {userId}})`);
    }
    return query.getCommandString();
};

const getTopicFilter = function (topics) {
    if (topics) {
        return db.cypher().optionalMatch(`(commitment)<-[:TOPIC]-(topic:Topic)`)
            .optionalMatch(`(topic)<-[:SUB_TOPIC*]-(nextTopic:Topic)`)
            .with(`creator, commitment, topic, collect(nextTopic) AS nextTopic`)
            .where(`topic.topicId IN {topics} OR ANY (t IN nextTopic WHERE t.topicId IN {topics})`)
            .getCommandString();
    }
    return ''
};

const getRegionFilter = function (regions) {
    if (regions) {
        return db.cypher().optionalMatch(`(commitment)-[:BELONGS_TO_REGION]->(region:Region)`)
            .optionalMatch(`(region)<-[:SUB_REGION*]-(nextRegion:Region)`)
            .with(`creator, commitment, region, collect(nextRegion) AS nextRegion, score`)
            .where(`region.regionId IN {regions} OR ANY (r IN nextRegion WHERE r.regionId IN {regions})`)
            .getCommandString();
    }
    return ''
};

const getPeriodOfTimeFilterQuery = function (periodOfTime) {
    return db.cypher().with(`creator, commitment, watches`)
        .where(`watches.created > {${periodOfTime}}`)
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
        .match(`(creator:User)-[:IS_CREATOR]->(commitment:Commitment)`)
        .where(`commitment.language IN {languages}`)
        .addCommand(getTopicFilter(topics))
        .addCommand(getTrustCircleFilter(trustCircle))
        .addCommand(getPeriodOfTimeFilter(periodOfTime))
        .with(`creator, commitment, count(DISTINCT watches) AS score`)
};

const getTrustCircleFilterForNewest = function (trustCircle) {
    if (trustCircle) {
        return `AND (creator)<-[:IS_CONTACT]-(:User {userId: {userId}})`
    }
    return '';
};

const getOrderByTimeQuery = function (trustCircle, topics) {
    return db.cypher()
        .match(`(creator:User)-[:IS_CREATOR]->(commitment:Commitment)`)
        .where(`commitment.language IN {languages}${getTrustCircleFilterForNewest(trustCircle)}`)
        .addCommand(getTopicFilter(topics))
        .with(`creator, commitment, 0 AS score`)
};

const getStartQuery = function (order, trustCircle, topics, periodOfTime) {
    if (order === 'mostPopular') {
        return getMostPopularQuery(trustCircle, topics, periodOfTime);
    } else if (order === 'noQuestionLink') {
        return getOrderByTimeQuery(trustCircle, topics)
            .where(`NOT (commitment)<-[:COMMITMENT]->(:CommitmentAnswer)<-[:ANSWER]-(:Question)`);
    }
    return getOrderByTimeQuery(trustCircle, topics);
};

const getFeed = async function (userId, page, timestamp, order, periodOfTime, guiLanguage, languages, trustCircle,
                                topics, regions) {
    page = page * PAGE_SIZE;

    let response = await getStartQuery(order, trustCircle, topics, periodOfTime)
        .addCommand(getRegionFilter(regions))
        .optionalMatch(`(commitment)<-[watches:WATCH]-(:User)`)
        .optionalMatch(`(commitment)-[:BELONGS_TO_REGION]->(region:Region)`)
        .return(`creator, commitment.commitmentId AS commitmentId, commitment.title AS title, 
                 commitment.created AS created, commitment.modified AS modified, commitment.description AS description, 
                 'Commitment' AS type, count(DISTINCT watches) AS numberOfWatches, score,
                 creator.userId = {userId} AS isLoggedInUser, collect(DISTINCT region.${guiLanguage}) AS regions,
                 EXISTS((creator)-[:IS_CONTACT]->(:User {userId: {userId}})) AS creatorTrustUser,
                 EXISTS((creator)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isTrustUser,
                 EXISTS((commitment)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin,
                 EXISTS((commitment)<-[:WATCH]-(:User {userId: {userId}})) AS isWatchedByUser`)
        .orderBy(`score DESC, created DESC`)
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({
            languages, userId, page, topics, regions, fourWeeks: time.getNowUtcTimestamp() - FOUR_WEEKS,
            oneWeek: time.getNowUtcTimestamp() - WEEK
        }).send();

    return {
        feed: await getFeedResponse(response), timestamp
    };
};

module.exports = {
    getFeed
};
