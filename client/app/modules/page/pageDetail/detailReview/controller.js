'use strict';

var initRating = function ($scope) {
    var i;
    $scope.rating = [];
    for (i = 0; i < 5; i++) {
        $scope.rating.push({numberOfRatings: 0, rating: 0, width: 1});
    }
};

var calculateSummaryRating = function ($scope) {
    $scope.totalNumberOfRatings = 0;
    $scope.summaryRating = 0;
    angular.forEach($scope.review.ratings, function (rating) {
        $scope.totalNumberOfRatings += rating.numberOfRatings;
        $scope.summaryRating += (rating.rating * rating.numberOfRatings);
        $scope.rating[rating.rating - 1] = rating;
        $scope.rating[rating.rating - 1].width = 1;
    });
    if ($scope.summaryRating > 0) {
        $scope.summaryRating = Math.round(($scope.summaryRating / $scope.totalNumberOfRatings) * 10) / 10;
    } else {
        $scope.summaryRating = 0;
    }
};

var calculateDiagramBlockWidth = function ($scope) {
    var i;
    $scope.review.ratings.sort(function (a, b) {
        return b.numberOfRatings - a.numberOfRatings;
    });
    for (i = 0; i < $scope.review.ratings.length; i++) {
        if (i === 0) {
            $scope.rating[$scope.review.ratings[0].rating - 1].width = 100;
        } else {
            $scope.rating[$scope.review.ratings[i].rating - 1].width =
                ($scope.review.ratings[i].numberOfRatings / $scope.review.ratings[0].numberOfRatings ) * 100;
        }
    }

};

var setCreateDate = function (reviews, moment) {
    angular.forEach(reviews, function (review) {
        review.created = moment.unix(review.created).format('LL');
    });
};
//$window.scrollTo(
var getRating = function ($scope, $stateParams, PageDetailReview, moment, skip, limit, skipCalculate) {
    $scope.review = PageDetailReview.get({
        skip: skip,
        maxItems: limit,
        onlyContacts: $scope.onlyContacts,
        pageId: $stateParams.pageId,
        label: $stateParams.label
    }, function () {
        if (!skipCalculate) {
            calculateSummaryRating($scope);
            calculateDiagramBlockWidth($scope);
        }
        setCreateDate($scope.review.reviews, moment);
    });
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$stateParams', 'PageDetailReview', 'moment',
            function ($scope, $stateParams, PageDetailReview, moment) {
                $scope.onlyContacts = $scope.onlyContacts === 'true';
                $scope.numberOfElements = 4;
                $scope.skipComments = 0;
                $scope.beginningSkip = {width: '610px'};

                initRating($scope);

                getRating($scope, $stateParams, PageDetailReview, moment, 0, 4);

                $scope.$on('page.detail.edit.child', function () {
                    getRating($scope, $stateParams, PageDetailReview, moment, 0, 4);
                });

                $scope.nextComments = function () {
                    $scope.skipComments += $scope.numberOfElements;
                    $scope.beginningSkip = {};
                    getRating($scope, $stateParams, PageDetailReview, moment, $scope.skipComments, $scope.numberOfElements, true);
                };

                $scope.previousComments = function () {
                    if ($scope.skipComments > 0) {
                        $scope.skipComments -= $scope.numberOfElements;
                        if ($scope.skipComments <= 0) {
                            $scope.skipComments = 0;
                            $scope.beginningSkip = {width: '610px'};
                            getRating($scope, $stateParams, PageDetailReview, moment, 0, 4);
                        } else {
                            getRating($scope, $stateParams, PageDetailReview, moment, $scope.skipComments, $scope.numberOfElements, true);
                        }
                    }
                };
            }];
    }
};
