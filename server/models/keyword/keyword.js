'use strict';

var db = require('./../../neo4j');

var getKeywords = function (params) {

    return db.cypher().match("(keyword:Keyword)")
        .return("keyword.de AS description")
        .orderBy("description")
        .skip("{skip}")
        .limit("{maxItems}")
        .end(params).send().then(function (resp) {
            return {keywords: resp};
        });
};

module.exports = {
    getKeywords: getKeywords
};
