'use strict';

module.exports = ['$state', 'UserStateService', 'ContactStatisticTypes',
    function ($state, UserStateService, ContactStatisticTypes) {
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
    }];

