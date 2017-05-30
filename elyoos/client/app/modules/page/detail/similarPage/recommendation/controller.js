'use strict';

module.exports = ['PageRecommendation', 'BlogRecommendation',
    function (PageRecommendation, BlogRecommendation) {
        var ctrl = this;

        ctrl.addRecommendation = function () {
            var service = PageRecommendation;
            if (ctrl.label === 'Blog') {
                service = BlogRecommendation;
            }
            ctrl.uploadRunning = true;
            service.save({pageId: ctrl.pageId}, function () {
                ctrl.uploadRunning = false;
                ctrl.pageRecommended = true;
            });
        };
    }];

