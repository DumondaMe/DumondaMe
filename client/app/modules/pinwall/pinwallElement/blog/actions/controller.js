'use strict';

module.exports = ['BlogRecommendation', 'errorToast', 'PinwallBlogService', function (BlogRecommendation, errorToast, PinwallBlogService) {
    var ctrl = this;

    ctrl.recommendBlog = function () {
        if (!ctrl.requestBlogRunning) {
            ctrl.requestBlogRunning = true;
            BlogRecommendation.save({blogId: ctrl.element.blogId}, function (resp) {
                ctrl.requestBlogRunning = false;
                ctrl.element.recommendedByUser = true;
                ctrl.element.recommendationId = resp.recommendationId;
                ctrl.element.numberOfRecommendations++;
            }, function () {
                ctrl.requestBlogRunning = false;
                errorToast.showError("Fehler beim Empfehlen des Blogs");
            });
        }
    };

    ctrl.removeRecommendationBlog = function () {
        if (!ctrl.requestBlogRunning) {
            ctrl.requestBlogRunning = true;
            BlogRecommendation.delete({blogId: ctrl.element.blogId, recommendationId: ctrl.element.recommendationId}, function () {
                ctrl.requestBlogRunning = false;
                PinwallBlogService.removeBlogRecommendation(ctrl.element.recommendationId, ctrl.element.blogId);
            }, function () {
                ctrl.requestBlogRunning = false;
                errorToast.showError("Fehler beim entfernen der Empfehlung des Blogs");
            });
        }
    };
}];

