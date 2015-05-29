'use strict';

var subCategory = 'Youtube';

var isValidYoutubeLink = function (link) {
    var isValidLink = false;
    if (angular.isString(link)) {
        if (link.indexOf('https://www.youtube.com/embed/') !== -1 || link.indexOf('https://www.youtube.com/watch?v=') !== -1) {
            isValidLink = true;
        }
    }
    return isValidLink;
};

var getYoutubeLink = function (link) {
    if(isValidYoutubeLink(link)) {
        if (link.indexOf('https://www.youtube.com/watch?v=') !== -1) {
            link = link.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');
        }
    }
    return link;
};

module.exports = ['$scope', '$state', '$stateParams', 'Languages', 'moment', 'PageDetail',
    function ($scope, $state, $stateParams, Languages, moment, PageDetail) {

        $scope.page.VideoPage = function () {
            var page = {
                videoPage: {
                    language: Languages.getCode($scope.category.selectedLanguage),
                    title: $scope.category.title,
                    description: $scope.page.description,
                    link: $scope.page.youtubeLinkFormatted
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
                    $scope.page.youtubeLinkFormatted = getYoutubeLink(link);
                }
            }
        });

    }];
