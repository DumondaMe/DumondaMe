'use strict';

var setCategories = function (pages, PageCategories) {
    angular.forEach(pages, function (page) {
        page.category = PageCategories.categories[page.label];
    });
};

module.exports = ['$scope', '$state', 'PageCategories', 'Languages', 'SearchPage',
    function ($scope, $state, PageCategories, Languages, SearchPage) {

        $scope.category = {};
        $scope.categories = PageCategories.getCategories();
        $scope.languages = [];
        $scope.sendButtonDisabled = true;
        $scope.showSuggestions = false;
        $scope.showCommonSection = false;
        $scope.imagePreview = 'app/img/default.jpg';

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
                if ($scope.pageSuggestions.pages.length > 0) {
                    setCategories($scope.pageSuggestions.pages, PageCategories);
                    $scope.showSuggestions = true;
                } else {
                    $scope.suggestionContinue();
                }
            });
        };

        $scope.abortCreatePage = function () {
            $state.go('page.overview');
        };

        $scope.suggestionContinue = function () {
            $scope.showSuggestions = false;
            $scope.showCommonSection = true;
        };

        $scope.$on('image.cropper.image.preview', function (event, data) {
            $scope.imagePreview = data;
        });

        $scope.createPage = function () {

        };
    }];
