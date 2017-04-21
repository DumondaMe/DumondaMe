'use strict';

module.exports = ['RecommendedContactScrollRequest', 'ContactGroupStatistic', 'StepperDialogScrollRequest',
    'Contact', 'errorToast',
    function (RecommendedContactScrollRequest, ContactGroupStatistic, StepperDialogScrollRequest, Contact, errorToast) {
        var ctrl = this;

        ctrl.users = {recommendedUser: []};
        RecommendedContactScrollRequest.reset();
        StepperDialogScrollRequest.setNextScrollRequestHandler(ctrl);

        ctrl.addContact = function (userId) {
            var groupName = ctrl.selectedGroup.group;
            ctrl.uploadRunning = true;
            if (angular.isObject(ctrl.selectedGroup) && groupName) {
                Contact.save({
                    contactIds: [userId],
                    mode: 'addContact',
                    description: groupName
                }, function () {
                    ctrl.users = {recommendedUser: []};
                    ctrl.uploadRunning = false;
                    RecommendedContactScrollRequest.reset();
                    ctrl.nextContactRecommendations();
                    ContactGroupStatistic.addContactToGroup(groupName);
                }, function () {
                    ctrl.uploadRunning = false;
                    errorToast.showError('Es ist ein Fehler aufgetretten!');
                });
            }
        };
        ctrl.nextScrollRequest = function () {
            if (ctrl.isActive) {
                ctrl.nextContactRecommendations();
            }
        };

        ctrl.nextContactRecommendations = function () {
            RecommendedContactScrollRequest.nextRequest(ctrl.users.recommendedUser).then(function (recommendedUsers) {
                ctrl.users = recommendedUsers;
            });
        };
        ctrl.nextContactRecommendations();
    }];
