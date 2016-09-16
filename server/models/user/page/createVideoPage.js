'use strict';

var db = require('./../../../neo4j');
var uuid = require('./../../../lib/uuid');
var time = require('./../../../lib/time');
var youtube = require('./youtubeUtils');
var logger = requireLogger.getLogger(__filename);

var createVideoPage = function (userId, params) {
    params.pageId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.linkEmbed = youtube.getEmbedLink(params.link);
    return db.cypher().match("(user:User {userId: {userId}})")
        .createUnique(`(user)-[:IS_ADMIN]->(:Page {pageId: {pageId}, title: {title}, description: {description}, link: {link}, linkEmbed: {linkEmbed}, 
                            modified: {created}, created: {created}, topic: {topic}, label: 'Youtube', language: {language}, linkHistory: [], 
                            linkHistoryDate: []})`)
        .end(params).send().then(function () {
            logger.info(`Created youtube page with id ${params.pageId}`);
            return {pageId: params.pageId, linkEmbed: params.linkEmbed};
        });
};

module.exports = {
    createVideoPage: createVideoPage
};
