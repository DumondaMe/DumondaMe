'use strict';

module.exports = ['PageRecommendation', 'errorToast', 'ElyModal', function (PageRecommendation, errorToast, ElyModal) {
    var ctrl = this;

    ctrl.recommendPage = function () {
        ElyModal.show('RecommendationAddCtrl', 'app/modules/recommendation/addRecommendation/template.html',
            {pageId: ctrl.element.pageId, title: ctrl.element.title}).then(function (resp) {
            ctrl.element.recommendedByUser = true;
            ctrl.element.userRecommendationId = resp.recommendationId;
            ctrl.element.numberOfRecommendations++;
        });
    };
}];

