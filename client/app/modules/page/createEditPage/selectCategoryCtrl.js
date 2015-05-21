'use strict';

var setCategories = function (pages, PageCategories) {
    angular.forEach(pages, function (page) {
        page.category = PageCategories.categories[page.label];
    });
};

module.exports = ['$scope', 'PageCategories', 'Languages', 'SearchPage',
    function ($scope, PageCategories, Languages, SearchPage) {

        $scope.categories = PageCategories.getCategories();
        $scope.languages = Languages.languages;
        $scope.categoryFinishedButtonDisabled = true;
        $scope.categoryFirstSelect = true;
        $scope.categoryTitleChanged = false;
        $scope.categoryTitlePrviouse = '';

        $scope.$watchCollection('category', function (newCategories) {
            if (newCategories.title && newCategories.selectedLanguage && newCategories.selectedCategory) {
                $scope.categoryFinishedButtonDisabled = false;
            } else {
                $scope.categoryFinishedButtonDisabled = true;
            }
        });

        $scope.categorySelectFinished = function () {
            var title = $scope.category.title;
            $scope.page.pageSuggestions = SearchPage.get({
                search: title,
                filterType: PageCategories.getPageType($scope.category.selectedCategory),
                filterLanguage: Languages.getCode($scope.category.selectedLanguage),
                isSuggestion: false
            }, function () {
                $scope.categoryFirstSelect = false;
                $scope.categoryTitleChanged = false;
                $scope.categoryTitlePrviouse = title;
                if ($scope.page.pageSuggestions.pages.length > 0) {
                    setCategories($scope.page.pageSuggestions.pages, PageCategories);
                    $scope.setNextState(2);
                } else {
                    $scope.setNextState(3);
                }
            });
        };

        $scope.$watch('category.title', function (newValue) {
            if (newValue && newValue.trim() !== '' && !$scope.categoryFirstSelect) {
                if (newValue !== $scope.categoryTitlePrviouse) {
                    $scope.categoryTitleChanged = true;
                    $scope.setNextState(1);
                } else {
                    if($scope.categoryTitleChanged) {
                        $scope.setPreviousState();
                    }
                    $scope.categoryTitleChanged = false;
                }
            } else {
                $scope.categoryTitleChanged = false;
            }
        });
    }];
