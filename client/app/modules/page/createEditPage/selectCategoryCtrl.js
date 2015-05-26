'use strict';

var setCategories = function (pages, PageCategories) {
    angular.forEach(pages, function (page) {
        page.category = PageCategories.categories[page.label];
    });
};

var isSubCategorySelected = function ($scope) {
    return $scope.subCategories.length > 0 && !$scope.category.selectedSubCategory;
};

module.exports = ['$scope', 'PageCategories', 'Languages', 'SearchPage',
    function ($scope, PageCategories, Languages, SearchPage) {

        $scope.categories = PageCategories.getCategories();
        $scope.languages = Languages.languages;
        $scope.categoryFinishedButtonDisabled = true;
        $scope.categoryFirstSelect = !$scope.mode.edit;
        $scope.categoryTitleChanged = false;
        $scope.subCategories = [];

        if (!$scope.mode.edit) {
            $scope.$watchCollection('category', function (newCategories) {
                if (newCategories) {
                    $scope.subCategories = PageCategories.getSubCategories(newCategories.selectedCategory);
                    if($scope.subCategories.length === 0 && $scope.category.selectedSubCategory) {
                        delete $scope.category.selectedSubCategory;
                    }
                }

                if (newCategories && newCategories.title && newCategories.selectedLanguage && newCategories.selectedCategory) {
                    $scope.categoryFinishedButtonDisabled = isSubCategorySelected($scope);
                } else {
                    $scope.categoryFinishedButtonDisabled = true;
                }
            });
        }

        $scope.setNextState = function (newState) {
            if (newState !== $scope.state.actual) {
                $scope.state.previous = $scope.state.actual;
                $scope.state.actual = newState;
            }
        };

        $scope.setPreviousState = function () {
            $scope.state.actual = $scope.state.previous;
        };

        $scope.suggestionContinue = function () {
            $scope.setNextState(3);
        };

        $scope.categorySelectFinished = function () {
            var title = $scope.category.title;
            $scope.pageSuggestions = SearchPage.get({
                search: title,
                filterType: PageCategories.getPageType($scope.category.selectedCategory),
                filterLanguage: Languages.getCode($scope.category.selectedLanguage),
                isSuggestion: false
            }, function () {
                $scope.categoryFirstSelect = false;
                $scope.categoryTitleChanged = false;
                if (!$scope.mode.edit) {
                    $scope.categoryTitlePrviouse = title;
                }
                if ($scope.pageSuggestions.pages.length > 0) {
                    setCategories($scope.pageSuggestions.pages, PageCategories);
                    $scope.setNextState(2);
                } else {
                    $scope.setNextState(3);
                }
            });
        };

        $scope.$watch('category.title', function (newValue) {
            if (newValue && newValue.trim() !== '' && !$scope.categoryFirstSelect) {
                if ($scope.mode.edit && !$scope.categoryTitlePrviouse) {
                    $scope.categoryTitlePrviouse = newValue;
                    $scope.categoryTitleChanged = false;
                } else {
                    if (newValue !== $scope.categoryTitlePrviouse) {
                        $scope.categoryTitleChanged = true;
                        $scope.setNextState(1);
                    } else {
                        if ($scope.categoryTitleChanged) {
                            $scope.setPreviousState();
                        }
                        $scope.categoryTitleChanged = false;
                    }
                }
            } else {
                $scope.categoryTitleChanged = false;
            }
        });
    }];
