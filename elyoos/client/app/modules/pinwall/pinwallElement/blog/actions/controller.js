'use strict';

module.exports = ['ElyModal', function (ElyModal) {
    var ctrl = this;

    ctrl.recommendBlog = function () {
        ElyModal.show('RecommendationAddCtrl', 'app/modules/recommendation/addRecommendation/template.html',
            {pageId: ctrl.element.pageId, title: ctrl.element.title, isBlog: true}).then(function (resp) {
            ctrl.element.recommendedByUser = true;
            ctrl.element.userRecommendationId = resp.recommendationId;
            ctrl.element.numberOfRecommendations++;
        });
    };
}];

