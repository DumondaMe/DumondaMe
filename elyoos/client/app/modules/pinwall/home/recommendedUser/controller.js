'use strict';

module.exports = ['$state', 'UserStateService', 'ContactGroupStatistic', 'RecommendedUserOnHomeSetting', 'ArrayHelper',
    function ($state, UserStateService, ContactGroupStatistic, RecommendedUserOnHomeSetting, ArrayHelper) {
        var ctrl = this;

        ctrl.addContact = function (userId, name) {
            UserStateService.addContact(userId, name).then(function (type) {
                ArrayHelper.removeElement(ctrl.recommendedUser, 'userId', userId);
                ContactGroupStatistic.addContactToGroup(type);
                ctrl.reloadPinwall();
            });
        };

        ctrl.hideContactSuggestion = function () {
            RecommendedUserOnHomeSetting.save({showOnHomeScreen: false}, function () {
                ctrl.recommendedUser.length = 0;
            });
        };
    }];

