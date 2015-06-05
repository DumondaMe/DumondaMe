'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'Languages', 'moment', 'PageDetail', 'PageCategories',
    function ($scope, $state, $stateParams, Languages, moment, PageDetail, PageCategories) {

        var isDateValid = function (date) {
            return moment(date, 'l', moment.locale(), true).isValid();
        };

        $scope.page.BookPage = function () {
            var bookPage = {
                bookPage: {
                    language: Languages.getCode($scope.category.selectedLanguage),
                    title: $scope.category.title,
                    description: $scope.page.description,
                    author: $scope.page.authors
                }
            };
            if ($scope.page.publishDate) {
                bookPage.bookPage.publishDate = moment.utc($scope.page.publishDate, 'l', moment.locale(), true).valueOf() / 1000;
            }
            if ($scope.mode.edit) {
                bookPage.bookPage.pageId = $stateParams.pageId;
            }
            return bookPage;
        };

        if ($scope.mode.edit) {
            $scope.$watch('pageDetail.page', function (newPageDetail) {
                $scope.category.selectedLanguage = Languages.getLanguage(newPageDetail.language);
                $scope.category.title = newPageDetail.title;
                $scope.page.description = newPageDetail.description;
                $scope.page.authors = newPageDetail.author[0].name;
                if (newPageDetail.publishDate) {
                    $scope.page.publishDate = moment.unix(newPageDetail.publishDate).format('l');
                }
                $scope.page.imagePreview = newPageDetail.titleUrl;
                $scope.commonSection.toCompare = {};
                $scope.commonSection.toCompareTitle = $scope.category.title;
                angular.copy($scope.page, $scope.commonSection.toCompare);
            });
        }

        $scope.$watch('page.publishDate', function (publicationDate) {
            if ($scope.commonForm && $scope.commonForm.inputPublicationDate) {
                if (publicationDate) {
                    $scope.commonForm.inputPublicationDate.$setValidity('custom', isDateValid(publicationDate));
                } else if (!publicationDate || publicationDate.trim() === '') {
                    $scope.commonForm.inputPublicationDate.$setValidity('custom', true);
                }
            }
        });

        $scope.getDateExample = function () {
            var unixTimestamp = 385974036;
            return moment.unix(unixTimestamp).format('l');
        };
    }];
