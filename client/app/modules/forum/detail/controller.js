'use strict';

module.exports = ['$scope', '$stateParams', '$mdSidenav', 'ForumQuestionDetail', 'ToolbarService', 'ForumQuestionDetailCollection',
    function ($scope, $stateParams, $mdSidenav, ForumQuestionDetail, ToolbarService, ForumQuestionDetailCollection) {
        var ctrl = this;
        ctrl.detail = ForumQuestionDetail.get({questionId: $stateParams.questionId}, function () {
            ForumQuestionDetailCollection.set(ctrl.detail);
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

