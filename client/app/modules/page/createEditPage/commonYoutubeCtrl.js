'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'Languages', 'fileUpload', 'moment', 'PageDetail', 'PageCategories',
    function ($scope, $state, $stateParams, Languages, fileUpload, moment, PageDetail, PageCategories) {

        $scope.page.youtubeLink = null;

        $scope.page.Youtube = function () {

        };

        if ($scope.mode.edit && $stateParams.label === 'Youtube') {
            $scope.pageDetail = PageDetail.get({pageId: $stateParams.pageId, label: $stateParams.label}, function () {

            });
        }

    }];
