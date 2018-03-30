'use strict';

const dashify = require('dashify');
const db = requireDb();
const cdn = require('elyoos-server-lib').cdn;
const PAGE_SIZE = 20;

const getCommitments = async function (commitments) {
    let results = [];
    for (let commitment of commitments) {
        results.push({
            answerId: commitment.commitment.answerId,
            title: commitment.commitment.title,
            slug: dashify(commitment.commitment.title),
            description: commitment.commitment.description,
            imageUrl: cdn.getPublicUrl(`commitment/${commitment.commitment.answerId}/120x120/title.jpg`),
            created: commitment.commitment.created,
            topics: commitment.topics
        });
    }
    return results;
};

const getFeed = async function (page, timestamp, region) {
    page = page * PAGE_SIZE;
    let response = await db.cypher()
        .match(`(commitment:Commitment)-[:BELONGS_TO_REGION]->(region:Region)`)
        .where(`commitment.created < {timestamp} AND 
        (region.code = {region} OR EXISTS((region)<-[:SUB_REGION*]-(:Region {code: {region}})))`)
        .optionalMatch(`(commitment)<-[:TOPIC]-(topic:Topic)`)
        .return(`commitment, collect(DISTINCT topic.name) AS topics`)
        .orderBy(`commitment.created DESC`)
        .skip(`{page}`).limit(`${PAGE_SIZE}`)
        .end({page, timestamp, region}).send();

    return {commitments: await getCommitments(response), timestamp};
};

module.exports = {
    getFeed
};
