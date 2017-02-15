'use strict';

module.exports = ['BlogRecommendation', 'errorToast', function (BlogRecommendation, errorToast) {
    var ctrl = this;

    ctrl.recommendBlog = function () {
        ctrl.uploadRunning = true;
        BlogRecommendation.save({pageId: ctrl.element.pageId}, function (resp) {
            ctrl.uploadRunning = false;
            ctrl.element.recommendedByUser = true;
            ctrl.element.userRecommendationId = resp.recommendationId;
            ctrl.element.totalNumberOfRecommendations++;
        }, function () {
            ctrl.uploadRunning = false;
            errorToast.showError('Blog konnte nicht empfohlen werden!');
        });
    };
}];

