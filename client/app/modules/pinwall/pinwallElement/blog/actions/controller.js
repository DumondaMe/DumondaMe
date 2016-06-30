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
                ctrl.requestRunning = false;
                PinwallBlogService.removeBlogRecommendation(ctrl.element.userRecommendationId, ctrl.element.blogId);
            }, function () {
                ctrl.requestRunning = false;
                errorToast.showError("Fehler beim entfernen der Empfehlung des Blogs");
            });
        }
    };
}];

