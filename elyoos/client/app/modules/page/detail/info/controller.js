'use strict';

module.exports = ['ElyModal', 'moment', 'Languages', 'UserDetailNavigation', 'PageUserRecommendation', 'errorToast',
    function (ElyModal, moment, Languages, UserDetailNavigation, PageUserRecommendation, errorToast) {
        var ctrl = this;

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

        ctrl.openLinkHistory = function () {
            if (ctrl.pageDetail.page.linkHistory.length > 0) {
                ElyModal.show('LinkHistoryCtrl', 'app/modules/page/detail/info/linkHistory/template.html',
                    {
                        linkHistory: ctrl.pageDetail.page.linkHistory,
                        linkHistoryDate: ctrl.pageDetail.page.linkHistoryDate,
                        label: ctrl.pageDetail.page.label
                    });
            }
        };

        ctrl.deleteRecommendation = function () {
            PageUserRecommendation.delete({
                pageId: ctrl.pageDetail.page.pageId,
                recommendationId: ctrl.pageDetail.recommendation.user.recommendationId
            }, function (resp) {
                ctrl.pageDetail.recommendation.summary = resp.recommendation;
                delete ctrl.pageDetail.recommendation.user;
                //reloadRatingOverview(ctrl.ratingOverviewAllCommands, ctrl.ratingOverviewContactCommands);
            }, function () {
                errorToast.showError("Fehler beim Löschen der Empfehlung");
            });
        };
    }];

