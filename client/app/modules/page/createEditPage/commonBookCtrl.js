'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'Languages', 'fileUpload', 'moment', 'PageDetail',
    function ($scope, $state, $stateParams, Languages, fileUpload, moment, PageDetail) {

        var isDateValid = function (date) {
            return moment(date, 'l', moment.locale(), true).isValid();
        };

        $scope.page.BookPage = function () {
            var publishDate;
            if ($scope.page.publicationDate) {
                publishDate = moment.utc($scope.page.publicationDate, 'l', moment.locale(), true).valueOf() / 1000
            }
            return {
                createBookPage: {
                    language: Languages.getCode($scope.category.selectedLanguage),
                    title: $scope.category.title,
                    description: $scope.page.description,
                    author: $scope.page.authors,
                    publishDate: publishDate
                }
            };
        };

        if ($scope.mode.edit && $stateParams.label === 'BookPage') {
            $scope.pageDetail = PageDetail.get({pageId: $stateParams.pageId, label: $stateParams.label}, function () {
                $scope.category.selectedLanguage = Languages.getLanguage($scope.pageDetail.page.language);
                $scope.category.title = $scope.pageDetail.page.title;
                $scope.category.selectedCategory = 'Buch';
                $scope.page.description = $scope.pageDetail.page.description;
                $scope.page.authors = $scope.pageDetail.page.author[0].name;
                if ($scope.pageDetail.page.publicationDate) {
                    $scope.page.publicationDate = moment.unix($scope.pageDetail.page.publicationDate).format('l');
                }
                $scope.page.imagePreview = $scope.pageDetail.page.titleUrl;
                $scope.commonSection.toCompare = {};
                angular.copy($scope.page, $scope.commonSection.toCompare);
            });
        }

        $scope.$watch('page.publicationDate', function (publicationDate) {
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
