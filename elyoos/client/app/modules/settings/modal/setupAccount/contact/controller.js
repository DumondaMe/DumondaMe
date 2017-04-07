'use strict';

module.exports = ['RecommendedContactScrollRequest', 'ContactStatistic', 'ContactGroupStatistic', 'Contact', 'errorToast',
    function (RecommendedContactScrollRequest, ContactStatistic, ContactGroupStatistic, Contact, errorToast) {
        var ctrl = this;

        ctrl.users = {recommendedUser: []};
        RecommendedContactScrollRequest.reset();

        ctrl.cancelNewGroup = function () {
            ctrl.showAddGroup = false;
        };

        ctrl.addNewGroupFinish = function (groupName) {
            ctrl.showAddGroup = false;
            ContactGroupStatistic.addGroup(groupName);
        };

        ctrl.addContact = function (userId) {
            var groupName = ctrl.selectedGroup.group;
            if (angular.isObject(ctrl.selectedGroup) && groupName) {
                Contact.save({
                    contactIds: [userId],
                    mode: 'addContact',
                    description: groupName
                }, function () {
                    ctrl.users = {recommendedUser: []};
                    RecommendedContactScrollRequest.reset();
                    ctrl.nextContactRecommendations();
                    ContactGroupStatistic.addContactToGroup(groupName);
                }, function () {
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
