'use strict';

let db = requireDb();

let searchKeywords = function (keyword) {

    let keyWordQueryRegEx = '(?i)'.concat(keyword, '.*');

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
