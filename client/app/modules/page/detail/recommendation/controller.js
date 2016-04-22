'use strict';

var reloadRatingOverview = function (allCommand, contactCommand) {
    if(allCommand.hasOwnProperty('reload')) {
        allCommand.reload();
    }
    if(contactCommand.hasOwnProperty('reload')) {
        contactCommand.reload();
    }
};

module.exports = ['PageUserRecommendation', 'ElyModal', '$mdDialog', 'errorToast', 'moment',
    function (PageUserRecommendation, ElyModal, $mdDialog, errorToast, moment) {
        var ctrl = this;

        ctrl.ratingOverviewAllCommands = {};
        ctrl.ratingOverviewContactCommands = {};

        ctrl.deleteRecommendation = function () {
            var confirm = $mdDialog.confirm()
                .title("Bewertung löschen")
                .textContent("Willst Du deine Bewertung wirklich löschen?")
                .ariaLabel("Delete Recommendation")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                PageUserRecommendation.delete({
                    pageId: ctrl.pageId,
                    recommendationId: ctrl.recommendation.user.recommendationId
                }, function (resp) {
                    ctrl.recommendation.summary = resp.recommendation;
                    delete ctrl.recommendation.user;
                    reloadRatingOverview(ctrl.ratingOverviewAllCommands, ctrl.ratingOverviewContactCommands);
                }, function () {
                    errorToast.showError("Fehler beim Löschen der Bewertung");
                });
            });
        };

        ctrl.addRecommendation = function () {
            ElyModal.show('RecommendationAddCtrl', 'app/modules/recommendation/addRecommendation/template.html',
                {pageId: ctrl.pageId, title: ctrl.title}).then(function (data) {
                ctrl.recommendation = data.recommendation;
                ctrl.recommendation.user.created = moment.unix(ctrl.recommendation.user.created).format('LL');
                reloadRatingOverview(ctrl.ratingOverviewAllCommands, ctrl.ratingOverviewContactCommands);
            });
        };
    }];

