'use strict';

module.exports = ['RecommendedContactScrollRequest', 'ContactStatistic', 'ContactGroupStatistic', 'Contact', 'errorToast',
    function (RecommendedContactScrollRequest, ContactStatistic, ContactGroupStatistic, Contact, errorToast) {
        var ctrl = this;

        ctrl.users = {recommendedUser: []};
        RecommendedContactScrollRequest.reset();

        ctrl.cancelNewGroup = function () {
            ctrl.uploadRunning = false;
            ctrl.showAddGroup = false;
        };

        ctrl.addNewGroupFinish = function (groupName) {
            ctrl.uploadRunning = false;
            ctrl.showAddGroup = false;
            ContactGroupStatistic.addGroup(groupName);
        };

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

        ctrl.nextContactRecommendations = function () {
            RecommendedContactScrollRequest.nextRequest(ctrl.users.recommendedUser).then(function (recommendedUsers) {
                ctrl.users = recommendedUsers;
            });
        };
        ctrl.nextContactRecommendations();
    }];
