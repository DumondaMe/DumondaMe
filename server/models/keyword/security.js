'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../lib/error/exceptions');
var logger = requireLogger.getLogger(__filename);

var allowedKeywords = function (keywords, req) {

    return db.cypher().match("(keyword:Keyword)")
        .where("keyword.de IN {keywords}")
        .return("count(*) AS numberOfKeywords")
        .end({keywords: keywords}).send().then(function (resp) {
            if (!resp[0] || resp[0].numberOfKeywords !== keywords.length) {
                return exceptions.getInvalidOperation(`Keyword does not exist in database ${keywords}`, logger, req);
            }
        });
};

module.exports = {
    allowedKeywords: allowedKeywords
};
