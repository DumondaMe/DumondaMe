'use strict';

var db = require('./../../../neo4j');
var logger = requireLogger.getLogger(__filename);
var underscore = require('underscore');
var uuid = require('./../../../lib/uuid');
var time = require('./../../../lib/time');
var security = require('./security');

var editVideoPage = function (userId, params, req) {

    return security.checkAllowedToEditPage(userId, params.pageId, 'VideoPage', req).then(function () {
        return db.cypher().match("(page:VideoPage {pageId: {pageId}})")
            .set('page', {
                language: params.language,
                description: params.description,
                link: params.link,
                title: params.title,
                modified: time.getNowUtcTimestamp()
            })
            .end({pageId: params.pageId})
            .send();
    });
};

module.exports = {
    editVideoPage: editVideoPage
};
