'use strict';

module.exports = ['$scope', 'ProfileRecommendationCtrl', function ($scope, SendRecommendation) {

    var allCategories = [
            {name: 'Bücher', property: 'book'},
            {name: 'Videos', property: 'video'},
            {name: 'Ausbildungen', property: 'education'},
            {name: 'Seminare', property: 'seminar'},
            {name: 'Praxen', property: 'practice'},
            {name: 'Diverses', property: 'miscellaneous'}
        ],
        bookCategories = [
            {name: 'Bücher', property: 'book'}
        ],
        linkCategories = [
            {name: 'Videos', property: 'video'},
            {name: 'Ausbildungen', property: 'education'},
            {name: 'Seminare', property: 'seminar'},
            {name: 'Praxen', property: 'practice'},
            {name: 'Diverses', property: 'miscellaneous'}
        ],
        clearRecommendationFields = function () {
            $scope.bookRecommendation.author = '';
            $scope.bookRecommendation.title = '';
            $scope.linkRecommendation.title = '';
            $scope.linkRecommendation.link = '';
            $scope.recommendation.ratingPositive = true;
            $scope.recommendation.comment = '';
            delete $scope.recommendation.id;
        },
        getSelectedCategory = function (category, categories) {
            var i;
            for (i = 0; i < categories.length; i = i + 1) {
                if (categories[i].property === category) {
                    return categories[i];
                }
            }
        };

    $scope.bookRecommendation = {
        author: '',
        title: ''
    };

    $scope.linkRecommendation = {
        author: '',
        link: ''
    };

    $scope.recommendation = {
        ratingPositive: true,
        comment: '',
        selectedCategory: '',
        categories: allCategories
    };

    $scope.addRecommendation = function () {
        $scope.headerState = "newRecommendation";
        $scope.recommendation.textSubmitButton = 'Hinzufügen';
        clearRecommendationFields();

        $scope.recommendation.categories = allCategories;
        $scope.recommendation.selectedCategory = $scope.recommendation.categories[0];
    };

    $scope.submitRecommendation = function () {
        var submitData;
        if ($scope.recommendation.selectedCategory.property === 'book') {
            submitData = {
                category: 'book',
                author: $scope.bookRecommendation.author,
                title: $scope.bookRecommendation.title,
                ratingPositive: $scope.recommendation.ratingPositive,
                comment: $scope.recommendation.comment
            };

            SendRecommendation.sendRecommendationUpdate($scope, submitData, $scope.recommendation.id, '/api/user/profile/recommendation/book');
        } else {
            submitData = {
                link: $scope.linkRecommendation.link,
                title: $scope.linkRecommendation.title,
                ratingPositive: $scope.recommendation.ratingPositive,
                comment: $scope.recommendation.comment,
                category: $scope.recommendation.selectedCategory.property
            };

            SendRecommendation.sendRecommendationUpdate($scope, submitData, $scope.recommendation.id, '/api/user/profile/recommendation/link');
        }
    };

    $scope.deleteRecommendation = function (recommendation) {
        var submitData = {
            id: recommendation.id
        };
        if (recommendation.category === 'book') {
            SendRecommendation.sendRecommendationDelete($scope, submitData, '/api/user/profile/recommendation/book');
        } else {
            SendRecommendation.sendRecommendationDelete($scope, submitData, '/api/user/profile/recommendation/link');
        }
    };

    $scope.updateRecommendation = function (recommendation) {
        $scope.recommendation.textSubmitButton = 'Ändern';
        $scope.headerState = "newRecommendation";
        clearRecommendationFields();
        if (recommendation.category === 'book') {
            $scope.recommendation.categories = bookCategories;
            $scope.recommendation.selectedCategory = $scope.recommendation.categories[0];
            $scope.bookRecommendation.author = recommendation.author;
            $scope.bookRecommendation.title = recommendation.title;
            $scope.recommendation.ratingPositive = recommendation.ratingPositive;
            $scope.recommendation.comment = recommendation.comment;
            $scope.recommendation.id = recommendation.id;
        } else {
            $scope.recommendation.categories = linkCategories;
            $scope.recommendation.selectedCategory = getSelectedCategory(recommendation.category, linkCategories);
            $scope.linkRecommendation.link = recommendation.link;
            $scope.linkRecommendation.title = recommendation.title;
            $scope.recommendation.ratingPositive = recommendation.ratingPositive;
            $scope.recommendation.comment = recommendation.comment;
            $scope.recommendation.id = recommendation.id;
        }
    };

    $scope.abort = function () {
        $scope.headerState = 'showRecommendation';
    };

}];
