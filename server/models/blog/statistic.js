'use strict';

var db = require('./../../neo4j');


var getNumberOfRecommendationsCommand = function (pageId) {

    return db.cypher().match("(blog:Blog {pageId: {pageId}})<-[:RECOMMENDS]-()")
        .return(`COUNT(*) AS numberOfRecommendations`)
        .end({pageId: pageId});
};

module.exports = {
    getNumberOfRecommendationsCommand: getNumberOfRecommendationsCommand
};
