'use strict';

module.exports = ['$scope', 'PageCategories', 'Languages', 'SearchPage',
    function ($scope, PageCategories, Languages, SearchPage) {

        $scope.category = {};
        $scope.categories = PageCategories.getCategories();
        $scope.languages = [];
        $scope.sendButtonDisabled = true;

        $scope.languages = Languages.languages;

        $scope.$watchCollection('category', function (newCategories) {
            if (newCategories.title && newCategories.selectedLanguage && newCategories.selectedCategory) {
                $scope.sendButtonDisabled = false;
            } else {
                $scope.sendButtonDisabled = true;
            }
        });

        $scope.categorySelectFinished = function () {
            $scope.pageSuggestions = SearchPage.get({
                search: $scope.category.title,
                filterType: PageCategories.getPageType($scope.category.selectedCategory),
                filterLanguage: Languages.getCode($scope.category.selectedLanguage),
                isSuggestion: false
            }, function () {

            });
        };
    }];
