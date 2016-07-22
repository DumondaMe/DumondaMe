'use strict';

module.exports = ['$state', 'UserStateService', 'ContactStatisticTypes', 'RecommendedUserOnHomeSetting',
    function ($state, UserStateService, ContactStatisticTypes, RecommendedUserOnHomeSetting) {
        var ctrl = this;

        ctrl.addContact = function (userId, name) {
            UserStateService.addContact(userId, name).then(function (type) {
                var indexToRemove = null;
                angular.forEach(ctrl.recommendedUser, function (user, index) {
                    if (user.userId === userId) {
                        indexToRemove = index;
                    }
                });
                if (angular.isNumber(indexToRemove)) {
                    ctrl.recommendedUser.splice(indexToRemove, 1);
                }
                ContactStatisticTypes.addContactByName(type);
            });
        };

        ctrl.hideContactSuggestion = function () {
            RecommendedUserOnHomeSetting.save({showOnHomeScreen: false}, function () {
                ctrl.recommendedUser.length = 0;
            });
        };
    }];

