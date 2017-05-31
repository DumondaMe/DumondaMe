'use strict';

module.exports = ['PageRecommendation', 'BlogRecommendation', 'SimilarPageHandlingRecommendation', 'errorToast',
    function (PageRecommendation, BlogRecommendation, SimilarPageHandlingRecommendation, errorToast) {
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
                SimilarPageHandlingRecommendation.pageRecommended();
                ctrl.numberOfRecommendations++;
            }, function () {
                ctrl.uploadRunning = false;
                errorToast.showError("Fehler beim empfehlen des Beitrages");
            });
        };
    }];

