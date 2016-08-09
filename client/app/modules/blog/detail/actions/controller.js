'use strict';

module.exports = ['BlogRecommendation', 'errorToast', '$stateParams', function (BlogRecommendation, errorToast, $stateParams) {
    var ctrl = this;

    ctrl.recommendBlog = function () {
        if (!ctrl.requestRunning) {
            ctrl.requestRunning = true;
            BlogRecommendation.save({blogId: $stateParams.blogId}, function (resp) {
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

