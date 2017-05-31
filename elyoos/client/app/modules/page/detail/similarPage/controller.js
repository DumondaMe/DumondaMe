'use strict';

module.exports = ['SimilarPages',
    function (SimilarPages) {
        var ctrl = this, skip = 0;
        ctrl.similarPages = {pages: []};

        ctrl.nextSimilarPages = function (maxItems) {
            ctrl.requestRunning = true;
            ctrl.requestPages = SimilarPages.get({pageId: ctrl.pageId, skip: skip, maxItems: maxItems}, function () {
                ctrl.requestRunning = false;
                ctrl.similarPages.pages = ctrl.similarPages.pages.concat(ctrl.requestPages.pages);
                skip += ctrl.requestPages.pages.length;
                if(ctrl.requestPages.pages.length < maxItems) {
                    ctrl.hideMoreButton = true;
                }
            });
        };

        ctrl.nextSimilarPages(4);
    }];

