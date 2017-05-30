'use strict';

module.exports = ['SimilarPages',
    function (SimilarPages) {
        var ctrl = this;

        ctrl.similarPages = SimilarPages.get({pageId: ctrl.pageId, skip: 0, maxItems: 15});
    }];

