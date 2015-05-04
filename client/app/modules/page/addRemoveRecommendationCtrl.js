'use strict';

module.exports = ['$scope', 'PromiseModal', 'PageRecommendation',
    function ($scope, PromiseModal, PageRecommendation) {


        $scope.addNewRecommendation = function (page, pageId, label, title) {
            var modalScope = $scope.$new(false);
            modalScope.recommendation = {
                pageId: pageId,
                label: label
            };
            PromiseModal.getModal({
                scope: modalScope,
                title: title,
                template: 'app/modules/recommendation/modalAddRecommendation.html',
                placement: 'center'
            }).show().then(function (resp) {
                if (!page.recommendation) {
                    page.recommendation = {};
                }
                page.recommendation.user = {
                    rating: resp.rating,
                    comment: resp.comment,
                    profileUrl: resp.profileUrl,
                    recommendationId: resp.recommendationId
                };
                page.recommendation.summary.contact = resp.recommendation.contact;
                page.recommendation.summary.all = resp.recommendation.all;
            });
        };

        $scope.removeRecommendation = function (page, pageId, label) {
            PromiseModal.getModal({
                title: 'Bewertung l\u00f6schen',
                content: 'Willst Du die Bewertung wirklich l\u00f6schen?',
                template: 'app/modules/util/dialog/yesNoDialog.html',
                placement: 'center'
            }).show().then(function () {
                PageRecommendation.delete({
                    recommendationId: page.recommendation.user.recommendationId,
                    pageId: pageId,
                    label: label
                }, function (resp) {
                    delete page.recommendation.user;
                    page.recommendation.summary.contact = resp.recommendation.contact;
                    page.recommendation.summary.all = resp.recommendation.all;
                });
            });
        };
    }];
