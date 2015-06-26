'use strict';

module.exports = ['$scope', 'PageLeftNavElements', 'PageUserAdministration', 'PageSearchUserAdministratedPage',
    function ($scope, PageLeftNavElements, PageUserAdministration, PageSearchUserAdministratedPage) {

        $scope.getPageService = PageUserAdministration;
        $scope.searchPageService = PageSearchUserAdministratedPage;

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

    }];
