'use strict';

module.exports = ['BlogRecommendation', 'errorToast', 'PinwallBlogService', function (BlogRecommendation, errorToast) {
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
}];

