'use strict';

module.exports = ['PageUserRecommendation', 'ElyModal', '$mdDialog', 'errorToast',
    function (PageUserRecommendation, ElyModal, $mdDialog, errorToast) {
        var ctrl = this;

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
                }, function () {
                    errorToast.showError("Fehler beim Löschen der Bewertung");
                });
            });
        };

        ctrl.addRecommendation = function () {
            ElyModal.show('RecommendationAddCtrl', 'app/modules/recommendation/addRecommendation/template.html',
                {pageId: ctrl.pageId, title: ctrl.title}).then(function (data) {
                ctrl.recommendation = data.recommendation;
            });
        };
    }];

