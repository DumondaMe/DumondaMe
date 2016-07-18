'use strict';

module.exports = ['$state', 'UserStateService', 'ContactStatisticTypes', 'ContactStatistic',
    function ($state, UserStateService, ContactStatisticTypes, ContactStatistic) {
    var ctrl = this;

    ctrl.goToContacting = function () {
        $state.go('contact.overview', {showContacting: true});
    };

    if (ContactStatisticTypes.getTypes().length === 0) {
        ctrl.statistics = ContactStatistic.get(function () {
            ContactStatisticTypes.setStatistic(ctrl.statistics.statistic);
            ctrl.typesExists = true;
        });
    } else {
        ctrl.typesExists = true;
    }

    ctrl.addContact = function (userId, name) {
        UserStateService.addContact(userId, name).then(function (type) {
            angular.forEach(ctrl.contacting.users, function (user) {
                if (user.userId === userId) {
                    user.contactOfUser = true;
                }
            });
            ContactStatisticTypes.addContactByName(type);
        });
    };
}];

