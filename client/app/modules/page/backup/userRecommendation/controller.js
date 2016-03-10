'use strict';
module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageLeftNavElements', 'PageUserRecommendation', 'PageSearchUserRecommendation',
            function ($scope, PageLeftNavElements, PageUserRecommendation, PageSearchUserRecommendation) {

                $scope.getPageService = PageUserRecommendation;
                $scope.searchPageService = PageSearchUserRecommendation;

                $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);
            }];
    }
};
