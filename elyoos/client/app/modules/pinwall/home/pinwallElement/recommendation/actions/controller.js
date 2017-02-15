'use strict';

module.exports = ['PageRecommendation', 'errorToast', function (PageRecommendation, errorToast) {
    var ctrl = this;

    ctrl.recommendPage = function () {
        ctrl.uploadRunning = true;
        PageRecommendation.save({pageId: ctrl.element.pageId}, function (resp) {
            ctrl.uploadRunning = false;
            ctrl.element.recommendedByUser = true;
            ctrl.element.userRecommendationId = resp.recommendationId;
            ctrl.element.totalNumberOfRecommendations++;
        }, function () {
            ctrl.uploadRunning = false;
            errorToast.showError('Beitrag konnte nicht empfohlen werden!');
        });
    };
}];

