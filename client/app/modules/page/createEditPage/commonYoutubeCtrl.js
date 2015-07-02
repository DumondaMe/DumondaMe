'use strict';

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

module.exports = ['$scope', '$state', '$stateParams', 'Languages',
    function ($scope, $state, $stateParams, Languages) {

        $scope.page.Youtube = function () {
            var page = {
                youtubePage: {
                    language: Languages.getCode($scope.category.selectedLanguage),
                    title: $scope.category.title,
                    description: $scope.page.description,
                    link: $scope.page.youtubeLinkFormatted
                }
            };
            if ($scope.mode.edit) {
                page.videoPage.pageId = $stateParams.pageId;
            }
            return page;
        };

        if ($scope.mode.edit) {
            if ($scope.mode.edit) {
                $scope.$watch('pageDetail.page', function (newPageDetail) {
                    $scope.category.selectedLanguage = Languages.getLanguage(newPageDetail.language);
                    $scope.category.title = newPageDetail.title;
                    $scope.page.description = newPageDetail.description;
                    $scope.page.youtubeLink = newPageDetail.link;
                    $scope.commonForm.inputYoutubeLink.$dirty = true;
                    $scope.commonSection.toCompare = {};
                    $scope.commonSection.toCompareTitle = $scope.category.title;
                    angular.copy($scope.page, $scope.commonSection.toCompare);
                });
            }
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
