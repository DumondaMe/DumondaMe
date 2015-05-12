'use strict';

module.exports = ['$scope', '$state', 'Languages', 'fileUpload', 'moment',
    function ($scope, $state, Languages, fileUpload, moment) {

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
    }];
