'use strict';

module.exports = ['PageRecommendation', 'errorToast', 'PinwallBlogService', function (PageRecommendation, errorToast) {
    var ctrl = this;

    ctrl.recommendPage = function () {
        if (!ctrl.requestRunning) {
            ctrl.requestRunning = true;
            PageRecommendation.save({pageId: ctrl.element.pageId}, function (resp) {
                ctrl.requestRunning = false;
                ctrl.element.recommendedByUser = true;
                ctrl.element.userRecommendationId = resp.recommendationId;
                ctrl.element.numberOfRecommendations++;
            }, function () {
                ctrl.requestRunning = false;
                errorToast.showError("Fehler beim Empfehlen des Blogs");
            });
        }
    };
}];

