'use strict';

var db = requireDb();
var administrator = require('./administrator');
var recommendation = require('./recommendation');
var response = require('./detailResponse');
var cdn = require('../../util/cdn');

var getDetail = function (pageId, label, userId) {

    var commands = [];

    commands.push(administrator.getAdministrator(pageId, userId));
    commands.push(recommendation.getUserRecommendation(pageId, userId));
    commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
    commands.push(recommendation.getRecommendationSummaryContacts(pageId, userId).getCommand());

    return db.cypher().match("(page:Page {pageId: {pageId}, label: 'Place'})")
        .optionalMatch("(place)-[:HAS]->(address:Address)")
        .return(`page.pageId AS pageId, page.title AS title, page.description AS description, page.topic AS topic, collect(address) AS addresses, 
                 page.created AS created, page.modified AS modified, page.label AS label, page.language AS language`)
        .end({pageId: pageId})
        .send(commands)
        .then(function (resp) {
            resp[4][0].imagePreview = cdn.getUrl('pages/' + pageId + '/preview.jpg');
            resp[4][0].imageNormal = cdn.getUrl('pages/' + pageId + '/normal.jpg');
            return response.getResponse(resp, resp[4][0], pageId, userId);
        });
};

module.exports = {
    getDetail: getDetail
};
