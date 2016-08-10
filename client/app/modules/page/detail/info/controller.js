'use strict';

module.exports = ['ElyModal', 'moment', 'Languages', 'UserDetailNavigation',
    function (ElyModal, moment, Languages, UserDetailNavigation) {
        var ctrl = this;

        if (ctrl.showInfo) {
            ctrl.showInfo = ctrl.showInfo === "true";
        } else {
            ctrl.showInfo = true;
        }

        ctrl.getLanguage = Languages.getLanguage;

        ctrl.addRecommendation = function () {
            ElyModal.show('RecommendationAddCtrl', 'app/modules/recommendation/addRecommendation/template.html',
                {pageId: ctrl.pageDetail.page.pageId, title: ctrl.pageDetail.page.title}).then(function (data) {
                ctrl.pageDetail.recommendation = data.recommendation;
                ctrl.pageDetail.recommendation.user.created = moment.unix(ctrl.pageDetail.recommendation.user.created).format('LL');
            });
        };

        ctrl.goToUserDetail = function (userId) {
            UserDetailNavigation.openUserDetail(userId);
        };
    }];

