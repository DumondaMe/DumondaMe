'use strict';

module.exports = ['$scope', 'RecommendedContactScrollRequest', 'ContactGroupStatistic',
    'ContactGroupStatisticUpdate',
    function ($scope, RecommendedContactScrollRequest, ContactGroupStatistic,
              ContactGroupStatisticUpdate) {
        var ctrl = this;

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
            delete ctrl.commandStepperDialog;
            ctrl.uploadRunning = false;
            ctrl.showAddGroup = false;
            ctrl.disableNavigation = false;
        };

        ctrl.addNewGroupFinish = function (groupName) {
            delete ctrl.commandStepperDialog;
            ctrl.uploadRunning = false;
            ctrl.showAddGroup = false;
            ctrl.disableNavigation = false;
            ContactGroupStatistic.addGroup(groupName);
        };

        ctrl.newGroupOpened = function () {
            ctrl.commandAbortStepperDialog = ctrl.cancelNewGroup;
            ctrl.commandStepperDialogLabel = 'Hinzufügen';
        };
    }];
