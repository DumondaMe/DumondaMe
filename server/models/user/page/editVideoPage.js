'use strict';

var db = require('./../../../neo4j');
var time = require('./../../../lib/time');
var security = require('./security');

var handlingLinkHistory = function (params) {
    return db.cypher().match("(page:Page {pageId: {pageId}})")
        .where("page.link <> {link}")
        .return("page")
        .end({pageId: params.pageId, link: params.link}).send().then(function (resp) {
            if (resp.length === 1) {
                return db.cypher().match("(page:Page {pageId: {pageId}})")
                    .addCommand("Set page.linkHistory = page.linkHistory + page.link ")
                    .addCommand("Set page.linkHistoryDate = page.linkHistoryDate + page.modified")
                    .set('page', {link: params.link,}).end({pageId: params.pageId}).send();
            }
        });
};

var editVideoPage = function (userId, params, req) {

    return security.checkAllowedToEditPage(userId, params.pageId, req).then(function () {
        return handlingLinkHistory(params);
    }).then(function () {
        return db.cypher().match("(page:Page {pageId: {pageId}})")
            .set('page', {
                topic: params.topic,
                description: params.description,
                language: params.language,
                modified: time.getNowUtcTimestamp()
            })
            .end({pageId: params.pageId})
            .send();
    });
};

module.exports = {
    editVideoPage: editVideoPage
};
