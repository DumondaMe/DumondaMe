'use strict';

var isValidYoutubeLink = function (link) {
    var isValidLink = false;
    if (angular.isString(link)) {
        isValidLink = link.search('https://www.youtube.com/embed/') !== -1;
    }
    return isValidLink;
};

module.exports = ['$scope', '$state', '$stateParams', 'Languages', 'moment', 'PageDetail', 'PageCategories',
    function ($scope, $state, $stateParams, Languages, moment, PageDetail, PageCategories) {

        $scope.page.Youtube = function () {

        };

        if ($scope.mode.edit && $stateParams.label === 'Youtube') {
            $scope.pageDetail = PageDetail.get({pageId: $stateParams.pageId, label: $stateParams.label}, function () {

            });
        }

        $scope.$watch('page.youtubeLink', function (link) {
            if ($scope.commonForm && $scope.commonForm.inputYoutubeLink) {
                if (link) {
                    $scope.commonForm.inputYoutubeLink.$setValidity('custom', isValidYoutubeLink(link));
                }
            }
        });

    }];
