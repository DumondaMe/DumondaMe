'use strict';

module.exports = ['$scope', 'PageLeftNavElements', 'PageUserAdministration',
    function ($scope, PageLeftNavElements, PageUserAdministration) {

        $scope.getPageService = PageUserAdministration;
        //$scope.searchPageService = PageSearchUserRecommendation;

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

    }];
