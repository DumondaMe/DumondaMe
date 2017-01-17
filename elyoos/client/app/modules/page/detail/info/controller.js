'use strict';

module.exports = ['ElyModal', 'moment', 'Languages', 'UserDetailNavigation', 'PageUserRecommendation', 'errorToast', '$stateParams',
    'PageRecommendation', 'BlogRecommendation',
    function (ElyModal, moment, Languages, UserDetailNavigation, PageUserRecommendation, errorToast, $stateParams, PageRecommendation,
              BlogRecommendation) {
        var ctrl = this;

        ctrl.getLanguage = Languages.getLanguage;
        ctrl.label = $stateParams.label;

        ctrl.addRecommendation = function () {
            var service = PageRecommendation;
            if (ctrl.label === 'Blog') {
                service = BlogRecommendation;
            }
            ctrl.uploadRunning = true;
            service.save({pageId: ctrl.pageDetail.page.pageId}, function (resp) {
                ctrl.uploadRunning = false;
                ctrl.pageDetail.recommendation = {
                    summary: resp.recommendation,
                    user: {created: resp.created, recommendationId: resp.recommendationId}
                };
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

