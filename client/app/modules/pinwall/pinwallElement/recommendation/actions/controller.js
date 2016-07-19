'use strict';

module.exports = ['PageRecommendation', 'errorToast', 'PinwallBlogService', function (PageRecommendation, errorToast, PinwallBlogService) {
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

    ctrl.removeRecommendationPage = function () {
        if (!ctrl.requestRunning) {
            ctrl.requestRunning = true;
            PageRecommendation.delete({pageId: ctrl.element.pageId, recommendationId: ctrl.element.userRecommendationId}, function () {
                if (ctrl.element.thisRecommendationByUser) {
                    PinwallBlogService.removePinwallElement().then(function () {
                        ctrl.requestRunning = false;
                    }, function () {
                        ctrl.requestRunning = false;
                    });
                } else {
                    ctrl.requestRunning = false;
                    ctrl.element.recommendedByUser = false;
                }
                ctrl.element.numberOfRecommendations--;
            }, function () {
                ctrl.requestRunning = false;
                errorToast.showError("Fehler beim Entfernen der Empfehlung");
            });
        }
    };
}];

