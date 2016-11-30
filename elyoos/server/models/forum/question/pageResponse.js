'use strict';

var _ = require('lodash');

var preparePageResponse = function (questionElements) {

    _.forEach(questionElements, function (questionElement) {
        var page = {};
        if (questionElement.hasOwnProperty('page')) {
            page.pageId = questionElement.page.pageId;
            page.label = questionElement.page.label;
            page.title = questionElement.page.title;
            page.description = questionElement.page.description;
            page.link = questionElement.page.link;

            questionElement.page = page;
        }
    });
};


module.exports = {
    preparePageResponse: preparePageResponse
};
