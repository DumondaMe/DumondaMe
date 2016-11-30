'use strict';

var db = requireDb();

var searchKeywords = function (keyword) {

    var keyWordQueryRegEx = '(?i)'.concat(keyword, '.*');

    return db.cypher().match("(keyword:Keyword)")
        .where('keyword.de =~ {keyWordQueryRegEx}')
        .return("keyword.de AS description")
        .end({keyWordQueryRegEx: keyWordQueryRegEx}).send().then(function (resp) {
            return {elements: resp};
        });
};

module.exports = {
    searchKeywords: searchKeywords
};
