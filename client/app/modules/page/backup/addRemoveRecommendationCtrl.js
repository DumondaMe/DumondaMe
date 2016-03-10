'use strict';

module.exports = ['$scope', 'ElyModal', 'PageRecommendation', 'moment',
    function ($scope, ElyModal, PageRecommendation, moment) {


        $scope.addNewRecommendation = function (page, pageId, title) {
            ElyModal.show({
                scope: {title: " " + title},
                templateUrl: 'app/modules/recommendation/modalAddRecommendation.html',
                controller: 'ModalAddRecommendationCtrl',
                resolve: {
                    pageId: function () {
                        return pageId;
                    }
                }

            }).then(function (resp) {
                if (!page.recommendation) {
                    page.recommendation = {};
                }
                page.recommendation.user = {
                    rating: resp.rating,
                    comment: resp.comment,
                    profileUrl: resp.profileUrl,
                    recommendationId: resp.recommendationId,
                    created: moment.unix(resp.created).format('LL')
                };
                page.recommendation.summary.contact = resp.recommendation.contact;
                page.recommendation.summary.all = resp.recommendation.all;
                $scope.$emit('page.detail.edit');
            });
        };

        $scope.removeRecommendation = function (page, pageId) {
            ElyModal.show({
                scope: {
                    title: 'Bewertung löschen',
                    content: 'Willst Du die Bewertung wirklich löschen?'
                },
                size: 'sm',
                templateUrl: 'app/modules/util/dialog/yesNoDialog.html'
            }).then(function () {
                PageRecommendation.delete({
                    recommendationId: page.recommendation.user.recommendationId,
                    pageId: pageId
                }, function (resp) {
                    delete page.recommendation.user;
                    page.recommendation.summary.contact = resp.recommendation.contact;
                    page.recommendation.summary.all = resp.recommendation.all;
                    $scope.$emit('page.detail.edit');
                });
            });
        };
    }];
