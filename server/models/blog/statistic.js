'use strict';

var db = require('./../../neo4j');


var getNumberOfRecommendationsCommand = function (blogId) {

    return db.cypher().match("(blog:Blog {blogId: {blogId}})<-[:RECOMMENDS]-()")
        .return(`COUNT(*) AS numberOfRecommendations`)
        .end({blogId: blogId});
};

module.exports = {
    getNumberOfRecommendationsCommand: getNumberOfRecommendationsCommand
};
