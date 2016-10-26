'use strict';

var db = require('./../../../neo4j');
var uuid = require('./../../../lib/uuid');
var time = require('./../../../lib/time');
var logger = requireLogger.getLogger(__filename);

var createPlacePage = function (userId, params) {
    params.pageId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    return db.cypher().match("(user:User {userId: {userId}})")
        .createUnique(`(user)-[:IS_ADMIN]->(page:Page {pageId: {pageId}, title: {title}, modified: {created}, created: {created}, label: 'Place'})
        foreach (address in {places} | CREATE (page)-[:HAS]->(:Address {description: address.description, latitude: toFloat(address.lat), 
        longitude: toFloat(address.lng)}))`)
        .end(params).send().then(function () {
            logger.info(`Created place page with id ${params.pageId}`);
            return {pageId: params.pageId};
        });
};

module.exports = {
    createPlacePage: createPlacePage
};
