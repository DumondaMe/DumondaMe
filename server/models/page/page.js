'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../lib/error/exceptions');
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);

var addImageUrl = function (previews) {
    underscore.forEach(previews, function (preview) {
        preview.url = 'app/img/page/default/pagePreview.png';
    });
};


var getAllPages = function (skip, limit, isSuggestion) {

    var commands = [];

    return db.cypher().match("(page)")
        .where("page:BookPage OR page:VideoPage OR page:SchoolPage OR page:CoursePage OR page:PracticePage OR " +
        "page:EventPage OR page:BlogPage OR page:StorePage")
        .return("page.pageId AS pageId, page.description AS description, page.title AS title, LABELS(page) AS types")
        .orderBy("page.created")
        .skip("{skip}")
        .limit("{limit}")
        .end({skip: skip, limit: limit})
        .send(commands)
        .then(function (resp) {
            addImageUrl(resp);
            return {pages: resp};
        });
};

module.exports = {
    getAllPages: getAllPages
};
