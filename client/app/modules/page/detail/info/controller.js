'use strict';

module.exports = ['ElyModal', 'moment', 'Languages',
    function (ElyModal, moment, Languages) {
        var ctrl = this;

        ctrl.addRecommendation = function () {
            ElyModal.show('RecommendationAddCtrl', 'app/modules/recommendation/addRecommendation/template.html',
                {pageId: ctrl.pageDetail.page.pageId, title: ctrl.pageDetail.page.title}).then(function (data) {
                ctrl.pageDetail.recommendation = data.recommendation;
                ctrl.pageDetail.recommendation.user.created = moment.unix(ctrl.pageDetail.recommendation.user.created).format('LL');
            });
        };

        ctrl.getLanguage = Languages.getLanguage;
    }];

