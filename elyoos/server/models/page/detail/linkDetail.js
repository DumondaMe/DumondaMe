'use strict';

let db = requireDb();
let administrator = require('./administrator');
let recommendation = require('./recommendation');
let response = require('./detailResponse');
let cdn = require('elyoos-server-lib').cdn;

let getDetail = function (pageId, label, userId) {

    let commands = [];

    commands.push(administrator.getAdministrator(pageId, userId));
    commands.push(recommendation.getUserRecommendation(pageId, userId));
    commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
    commands.push(recommendation.getRecommendationSummaryContacts(pageId, userId).getCommand());

    return db.cypher().match("(page:Page {pageId: {pageId}, label: {label}})")
        .return(`page.pageId AS pageId, page.title AS title, page.description AS description, page.topic AS topic, page.link AS link,
                 page.hostname AS hostname, page.created AS created, page.modified AS modified, page.heightPreviewImage AS heightPreviewImage,
                 page.label AS label, page.language AS language`)
        .end({pageId: pageId, label: label})
        .send(commands)
        .then(function (resp) {
            if (resp[4][0].heightPreviewImage) {
                resp[4][0].imageUrl = cdn.getUrl('pages/' + pageId + '/normal.jpg');
            }
            return response.getResponse(resp, resp[4][0], pageId, userId);
        });
};

module.exports = {
    getDetail: getDetail
};
