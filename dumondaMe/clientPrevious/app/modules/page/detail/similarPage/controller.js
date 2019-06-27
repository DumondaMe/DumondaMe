'use strict';

module.exports = ['SimilarPages', 'SimilarPageHandlingRecommendation',
    function (SimilarPages, SimilarPageHandlingRecommendation) {
        var ctrl = this, skip = 0;
        ctrl.similarPages = {pages: []};

        SimilarPageHandlingRecommendation.setRegister(ctrl);

        ctrl.nextSimilarPages = function (maxItems) {
            ctrl.requestRunning = true;
            ctrl.requestPages = SimilarPages.get({pageId: ctrl.pageId, skip: skip, maxItems: maxItems}, function () {
                ctrl.requestRunning = false;
                ctrl.similarPages.pages = ctrl.similarPages.pages.concat(ctrl.requestPages.pages);
                skip += ctrl.requestPages.pages.length;
                if (ctrl.requestPages.pages.length < maxItems) {
                    ctrl.hideMoreButton = true;
                }
            });
        };

        ctrl.pageRecommended = function () {
            if (skip > 0) {
                skip = skip - 1;
            }
        };

        ctrl.nextSimilarPages(4);
    }];

