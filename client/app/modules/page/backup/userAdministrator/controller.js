'use strict';
module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageLeftNavElements', 'PageUserAdministration', 'PageSearchUserAdministratedPage',
            function ($scope, PageLeftNavElements, PageUserAdministration, PageSearchUserAdministratedPage) {

                $scope.getPageService = PageUserAdministration;
                $scope.searchPageService = PageSearchUserAdministratedPage;

                $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

            }];
    }
};
