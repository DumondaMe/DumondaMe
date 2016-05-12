'use strict';

module.exports = ['$scope', '$stateParams', '$mdSidenav', 'ForumQuestionDetail', 'ToolbarService',
    function ($scope, $stateParams, $mdSidenav, ForumQuestionDetail, ToolbarService) {
        var ctrl = this;
        ctrl.detail = ForumQuestionDetail.get({questionId: $stateParams.questionId}, function (resp) {

        });

        ctrl.openSideNavRight = function () {
            $mdSidenav('rightQuestionNav').open();
        };

        $scope.isSideNavOpen = false;

        $scope.$watch('isSideNavOpen', function (isOpen) {
            if (isOpen) {
                ToolbarService.disable();
            } else {
                ToolbarService.enable();
            }
        });
    }];

