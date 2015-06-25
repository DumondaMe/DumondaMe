'use strict';

module.exports = ['$scope', 'PageLeftNavElements', 'PageUserRecommendation',
    function ($scope, PageLeftNavElements, PageUserRecommendation) {

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.pagePreviews = PageUserRecommendation.get({skip: 0, maxItems: 50});

    }];
