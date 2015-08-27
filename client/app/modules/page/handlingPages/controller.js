'use strict';


module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageCategoryHandler', 'PageHandlingState', 'PageLeftNavElements',
            function ($scope, PageCategoryHandler, PageHandlingState, PageLeftNavElements) {

                //Just temporary, shall be replaced with an observer
                $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

                PageCategoryHandler.reset();
                PageHandlingState.reset();
            }];
    }
};
