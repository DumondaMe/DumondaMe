'use strict';

let db = requireDb();
let uuid = require('elyoos-server-lib').uuid;
let time = require('elyoos-server-lib').time;
let youtube = require('./../youtubeUtils');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let createVideoPage = function (userId, params) {
    params.pageId = uuid.generateUUID();
    params.recommendationId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.linkEmbed = youtube.getEmbedLink(params.link);
    return db.cypher().match("(user:User {userId: {userId}})")
        .createUnique(`(user)-[:IS_ADMIN]->(page:Page {pageId: {pageId}, title: {title}, description: {description}, link: {link}, linkEmbed: {linkEmbed}, 
               modified: {created}, created: {created}, topic: {topic}, label: 'Youtube', language: {language}, linkHistory: [], linkHistoryDate: []})
               <-[:RECOMMENDS]-(rec:Recommendation:PinwallElement {recommendationId: {recommendationId}, created: {created}})<-[:RECOMMENDS]-(user)`)
        .with(`page, rec`)
        .createUnique(`(rec)-[:PINWALL_DATA]->(page)`)
        .end(params).send().then(function () {
            logger.info(`Created youtube page with id ${params.pageId}`);
            return {pageId: params.pageId, linkEmbed: params.linkEmbed};
        });
};

module.exports = {
    createVideoPage: createVideoPage
};
