'use strict';

module.exports = ['$scope', '$state', 'Languages', 'fileUpload', 'moment',
    function ($scope, $state, Languages, fileUpload, moment) {

        var isDateValid = function (date) {
            return moment(date, 'l', moment.locale(), true).isValid();
        };

        $scope.page.BookPage = function() {
            return {
                createBookPage: {
                    language: Languages.getCode($scope.category.selectedLanguage),
                    title: $scope.category.title,
                    description: $scope.page.description,
                    author: $scope.page.authors,
                    publishDate: moment.utc($scope.page.publicationDate, 'l', moment.locale(), true).valueOf() / 1000
                }
            };
        };

        $scope.$watch('page.publicationDate', function (publicationDate) {
            if (publicationDate && $scope.commonForm && $scope.commonForm.inputPublicationDate) {
                $scope.commonForm.inputPublicationDate.$setValidity('custom', isDateValid(publicationDate));
            }
        });

        $scope.getDateExample = function () {
            var unixTimestamp = 385974036;
            return moment.unix(unixTimestamp).format('l');
        };
    }];
