'use strict';

var subCategory = 'Youtube';

var isValidYoutubeLink = function (link) {
    var isValidLink = false;
    if (angular.isString(link)) {
        isValidLink = link.search('https://www.youtube.com/embed/') !== -1;
    }
    return isValidLink;
};

module.exports = ['$scope', '$state', '$stateParams', 'Languages', 'moment', 'PageDetail', 'PageCategories',
    function ($scope, $state, $stateParams, Languages, moment, PageDetail, PageCategories) {

        $scope.page.VideoPage = function () {
            var page = {
                videoPage: {
                    language: Languages.getCode($scope.category.selectedLanguage),
                    title: $scope.category.title,
                    description: $scope.page.description,
                    link: $scope.page.youtubeLink
                }
            };
            if ($scope.mode.edit) {
                page.videoPage.pageId = $stateParams.pageId;
            } else {
                page.videoPage.subCategory = subCategory;
            }
            return page;
        };

        if ($scope.mode.edit && $scope.category.selectedCategoryType === subCategory) {
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
