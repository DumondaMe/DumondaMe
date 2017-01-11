'use strict';

let db = requireDb();
let administrator = require('./administrator');
let recommendation = require('./recommendation');
let response = require('./detailResponse');

let getDetail = function (pageId, label, userId) {

    let commands = [];

    commands.push(administrator.getAdministrator(pageId, userId));
    commands.push(recommendation.getUserRecommendation(pageId, userId));
    commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
    commands.push(recommendation.getRecommendationSummaryContacts(pageId, userId).getCommand());

    return db.cypher().match("(page:Page {pageId: {pageId}, label: {label}})")
        .return(`page.pageId AS pageId, page.title AS title, page.description AS description, page.topic AS topic, page.link AS link,  
                 page.linkEmbed AS linkEmbed, page.created AS created, page.modified AS modified, page.label AS label, page.language AS language, 
                 page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate`)
        .end({pageId: pageId, label: label})
        .send(commands)
        .then(function (resp) {
            return response.getResponse(resp, resp[4][0], pageId, userId);
        });
};

module.exports = {
    getDetail: getDetail
};
