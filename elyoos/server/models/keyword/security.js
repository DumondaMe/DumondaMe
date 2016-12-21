'use strict';

var db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

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
