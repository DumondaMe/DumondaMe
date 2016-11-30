'use strict';

var db = requireDb();

var getKeywords = function (params) {

    return db.cypher().match("(keyword:Keyword)")
        .return("keyword.de AS description")
        .orderBy("description")
        .skip("{skip}")
        .limit("{maxItems}")
        .end(params).send().then(function (resp) {
            return {elements: resp};
        });
};

module.exports = {
    getKeywords: getKeywords
};
