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
                .title("Empfehlung löschen")
                .textContent("Willst Du deine Empfehlung wirklich löschen?")
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
                    errorToast.showError("Fehler beim Löschen der Empfehlung");
                });
            });
        };
    }];

