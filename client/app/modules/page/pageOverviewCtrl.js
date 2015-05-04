'use strict';

var categories = {
    BookPage: 'Buch',
    VideoPage: 'Video',
    CoursePage: 'Kurs',
    SchoolPage: 'Schule'
};

module.exports = ['$scope', '$state', 'Page',
    function ($scope, $state, Page) {

        $scope.itemsPerPage = 30;

        $scope.page = Page.get({maxItems: $scope.itemsPerPage, skip: 0, isSuggestion: false}, function () {
            angular.forEach($scope.page.pages, function (page) {
                page.category = categories[page.label];
            });
        });

        $scope.openDetail = function (pageId, label) {
            $state.go('page.detail', {
                label: label,
                pageId: pageId
            });
        };
    }];
