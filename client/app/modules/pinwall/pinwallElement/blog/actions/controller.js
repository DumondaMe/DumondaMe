'use strict';

module.exports = ['BlogRecommendation', 'errorToast', 'PinwallBlogService', function (BlogRecommendation, errorToast, PinwallBlogService) {
    var ctrl = this;

    ctrl.recommendBlog = function () {
        if (!ctrl.requestRunning) {
            ctrl.requestRunning = true;
            BlogRecommendation.save({blogId: ctrl.element.blogId}, function (resp) {
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

    ctrl.removeRecommendationBlog = function () {
        if (!ctrl.requestRunning) {
            ctrl.requestRunning = true;
            BlogRecommendation.delete({blogId: ctrl.element.blogId, recommendationId: ctrl.element.userRecommendationId}, function () {
                if (ctrl.element.thisRecommendationByUser) {
                    PinwallBlogService.removeBlogRecommendation(ctrl.element.userRecommendationId, ctrl.element.blogId).then(function () {
                        ctrl.requestRunning = false;
                    }, function () {
                        ctrl.requestRunning = false;
                    });
                } else {
                    ctrl.element.numberOfRecommendations--;
                    ctrl.element.recommendedByUser = false;
                    ctrl.requestRunning = false;
                }
            }, function () {
                ctrl.requestRunning = false;
                errorToast.showError("Fehler beim entfernen der Empfehlung des Blogs");
            });
        }
    };
}];

