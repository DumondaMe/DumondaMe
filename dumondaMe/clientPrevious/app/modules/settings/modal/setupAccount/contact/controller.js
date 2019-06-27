'use strict';

module.exports = ['$scope', 'RecommendedContactScrollRequest', 'ContactGroupStatistic',
    'ContactGroupStatisticUpdate', 'StepperDialogSteps', 'StepperDialogCommandHandler',
    function ($scope, RecommendedContactScrollRequest, ContactGroupStatistic,
              ContactGroupStatisticUpdate, StepperDialogSteps, StepperDialogCommandHandler) {
        var ctrl = this;

        ctrl.step = {
            label: 'Kontakte',
            selected: false
        };
        StepperDialogSteps.addStep(ctrl.step);

        ctrl.users = {recommendedUser: []};
        ctrl.contact = {};
        RecommendedContactScrollRequest.reset();
        //Statistic has been loaded with first userInfo request.
        ctrl.statistics = ContactGroupStatistic.getStatisticWithContacts();
        ContactGroupStatistic.register('setupAccountContact', ctrl);

        ctrl.groupStatisticChanged = function () {
            ContactGroupStatisticUpdate.update(ctrl.statistics,
                ContactGroupStatistic.getStatisticWithContacts());
        };

        $scope.$on("$destroy", function () {
            ContactGroupStatistic.deregister('setupAccountContact');
        });

        ctrl.cancelNewGroup = function () {
            ctrl.showAddGroup = false;
            StepperDialogCommandHandler.hideProgressBar();
            StepperDialogCommandHandler.enableNavigation();
            StepperDialogCommandHandler.hideButtonCommand();
        };

        ctrl.addNewGroupFinish = function (groupName) {
            ctrl.showAddGroup = false;
            StepperDialogCommandHandler.hideProgressBar();
            StepperDialogCommandHandler.enableNavigation();
            StepperDialogCommandHandler.hideButtonCommand();
            ContactGroupStatistic.addGroup(groupName);
        };

        ctrl.newGroupOpened = function () {
            ctrl.showAddGroup = true;
            StepperDialogCommandHandler.showButtonCommand(ctrl.cancelNewGroup, ctrl.commandAddNewGroup, 'Hinzufügen');
        };

        ctrl.commandAddNewGroup = function () {
            ctrl.commandAddNewGroupEvent();
        };

        ctrl.uploadRunning = function (isRunning) {
            if(isRunning) {
                StepperDialogCommandHandler.showProgressBar();
            } else {
                StepperDialogCommandHandler.hideProgressBar();
            }
        };

        ctrl.validGroupName = function (disabled) {
            if (!disabled) {
                StepperDialogCommandHandler.enableButtonCommand();
            } else {
                StepperDialogCommandHandler.disableButtonCommand();
            }
        };
    }];
