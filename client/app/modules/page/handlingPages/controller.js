'use strict';


module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageCategoryHandler', 'PageHandlingState', 'PageLoader', 'PageEditModeService', 'PageLeftNavElements',
            function ($scope, PageCategoryHandler, PageHandlingState, PageLoader, PageEditModeService, PageLeftNavElements) {

                //Just temporary, shall be replaced with an observer
                $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

                PageCategoryHandler.reset();
                PageHandlingState.reset();
                PageLoader.reset();
                PageEditModeService.reset();
            }];
    }
};
