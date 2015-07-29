'use strict';

module.exports = ['$scope', 'PageCategories', 'Languages', 'SearchPage',
    function ($scope, PageCategories, Languages, SearchPage) {

        $scope.categories = PageCategories.getCategories();
        $scope.languages = Languages.languages;
        $scope.categoryFinishedButtonDisabled = true;
        $scope.categoryFirstSelect = !$scope.mode.edit;
        $scope.categoryTitleChanged = false;

        $scope.SearchPage = SearchPage;
        $scope.SearchPageParameter = {};

        if (!$scope.mode.edit) {
            $scope.$watchCollection('category', function (newCategories) {

                if (newCategories && newCategories.title && newCategories.selectedLanguage && newCategories.selectedCategory) {
                    $scope.categoryFinishedButtonDisabled = false;
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

            $scope.SearchPageParameter = {
                search: $scope.category.title,
                filterType: PageCategories.getPageType($scope.category.selectedCategory),
                filterLanguage: Languages.getCode($scope.category.selectedLanguage),
                isSuggestion: false
            };
        };

        $scope.$on('page.preview.request.finished', function (event, pages) {
            $scope.categoryFirstSelect = false;
            $scope.categoryTitleChanged = false;
            if (!$scope.mode.edit) {
                $scope.categoryTitlePrviouse = $scope.category.title;
            }
            if (pages.length > 0) {
                $scope.setNextState(2);
            } else {
                $scope.setNextState(3);
            }
        });

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
