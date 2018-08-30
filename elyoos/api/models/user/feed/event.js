'use strict';

const slug = require('limax');
const cdn = require('elyoos-server-lib').cdn;
const db = requireDb();

const PAGE_SIZE = 20;

const getFeedResponse = async function (commitments) {
    for (let commitment of commitments) {
        commitment.commitmentSlug = slug(commitment.commitmentTitle);
        commitment.commitmentImageUrl = cdn.getPublicUrl(`commitment/${commitment.commitmentId}/40x40/title.jpg`);
        commitment.commitmentImageUrlPreview = cdn.getPublicUrl(`commitment/${commitment.commitmentId}/210x210/title.jpg`);
        if (commitment.modified) {
            commitment.commitmentImageUrl = commitment.commitmentImageUrl + `?v=${commitment.modified}`;
            commitment.commitmentImageUrlPreview = commitment.commitmentImageUrlPreview + `?v=${commitment.modified}`;
        }
    }
    return commitments;
};

const getTopicFilter = function (topics) {
    if (topics) {
        return db.cypher().optionalMatch(`(commitment)<-[:TOPIC]-(topic:Topic)`)
            .optionalMatch(`(topic)<-[:SUB_TOPIC*]-(nextTopic:Topic)`)
            .with(`event, commitment, topic, collect(nextTopic) AS nextTopic`)
            .where(`topic.topicId IN {topics} OR ANY (t IN nextTopic WHERE t.topicId IN {topics})`)
            .getCommandString();
    }
    return ''
};

const getRegionFilter = function (regions) {
    if (regions) {
        return db.cypher().optionalMatch(`(event)-[:BELONGS_TO_REGION]->(region:Region)`)
            .optionalMatch(`(region)<-[:SUB_REGION*]-(nextRegion:Region)`)
            .with(`commitment, event, region, collect(nextRegion) AS nextRegion`)
            .where(`region.regionId IN {regions} OR ANY (r IN nextRegion WHERE r.regionId IN {regions})`)
            .getCommandString();
    }
    return ''
};

const getInterestedOnlyFilter = function (interestedOnly) {
    if (interestedOnly) {
        return `AND (commitment)<-[:WATCH]-(:User {userId: {userId}})`
    }
    return '';
};

const getFeed = async function (userId, page, timestamp, guiLanguage, languages, interestedOnly, topics, regions) {
    page = page * PAGE_SIZE;

    let response = await db.cypher()
        .match(`(commitment:Commitment)-[:EVENT]->(event:Event)`)
        .where(`commitment.language IN {languages} AND event.endDate > {timestamp}
                ${getInterestedOnlyFilter(interestedOnly)}`)
        .addCommand(getTopicFilter(topics))
        .addCommand(getRegionFilter(regions))
        .optionalMatch(`(event)-[:BELONGS_TO_REGION]->(region:Region)`)
        .return(`commitment.commitmentId AS commitmentId, commitment.title AS commitmentTitle, 
                 commitment.description AS commitmentDescription, commitment.modified AS modified, 
                 event.title AS title, event.eventId AS eventId, 
                 event.description AS description, region.${guiLanguage} AS region, event.location AS location,
                 event.startDate AS startDate, event.endDate AS endDate, 'Event' AS type`)
        .orderBy(`startDate`)
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({
            languages, userId, page, topics, regions, timestamp
        }).send();

    return {
        feed: await getFeedResponse(response), timestamp
    };
};

module.exports = {
    getFeed
};
