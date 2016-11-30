'use strict';

module.exports = ['$scope', '$stateParams', '$mdSidenav', '$mdMedia', 'ForumQuestionDetail', 'ToolbarService', 'ForumQuestionDetailCollection',
    function ($scope, $stateParams, $mdSidenav, $mdMedia, ForumQuestionDetail, ToolbarService, ForumQuestionDetailCollection) {
        var ctrl = this;
        ctrl.$mdMedia = $mdMedia;

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

        ctrl.removedSolution = function(index) {
            ctrl.detail.solution.splice(index, 1);
        };

        ctrl.removedExplanation = function(index) {
            ctrl.detail.explanation.splice(index, 1);
        };
    }];
