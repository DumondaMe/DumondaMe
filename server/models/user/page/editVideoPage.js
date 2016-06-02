'use strict';

var db = require('./../../../neo4j');
var time = require('./../../../lib/time');
var security = require('./security');

var editVideoPage = function (userId, params, req) {

    return security.checkAllowedToEditPage(userId, params.pageId, req).then(function () {
        return db.cypher().match("(page:Page {pageId: {pageId}})")
            .set('page', {
                topic: params.topic,
                description: params.description,
                modified: time.getNowUtcTimestamp()
            })
            .end({pageId: params.pageId})
            .send();
    });
};

module.exports = {
    editVideoPage: editVideoPage
};
