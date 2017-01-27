'use strict';

let db = requireDb();
let administrator = require('./administrator');
let recommendation = require('./recommendation');
let response = require('./detailResponse');
let cdn = require('elyoos-server-lib').cdn;

let hasEvent = function (pageId) {
    return db.cypher().match("(page:Page {pageId: {pageId}})")
        .return("EXISTS((page)-[:EVENT]->(:Event)) AS hasEvents").end({pageId: pageId}).getCommand();
};

let getDetail = function (pageId, label, userId) {

    let commands = [];

    commands.push(administrator.getAdministrator(pageId, userId));
    commands.push(recommendation.getUserRecommendation(pageId, userId));
    commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
    commands.push(recommendation.getRecommendationSummaryContacts(pageId, userId).getCommand());
    commands.push(hasEvent(pageId));

    return db.cypher().match("(page:Page {pageId: {pageId}, label: 'Generic'})")
        .optionalMatch("(page)-[:HAS]->(address:Address)")
        .return(`page.pageId AS pageId, page.title AS title, page.description AS description, page.topic AS topic, collect(address) AS addresses, 
                 page.created AS created, page.modified AS modified, page.label AS label, page.language AS language`)
        .end({pageId: pageId})
        .send(commands)
        .then(function (resp) {
            resp[5][0].imagePreview = cdn.getUrl('pages/' + pageId + '/preview.jpg');
            resp[5][0].imageNormal = cdn.getUrl('pages/' + pageId + '/normal.jpg');
            let result = response.getResponse(resp, resp[5][0], pageId, userId);
            result.hasEvents = resp[4][0].hasEvents;
            return result;
        });
};

module.exports = {
    getDetail: getDetail
};
