'use strict';

module.exports = ['$state', 'UserStateService', 'ContactStatisticTypes',
    function ($state, UserStateService, ContactStatisticTypes) {
    var ctrl = this;

    ctrl.goToContacting = function () {
        $state.go('contact.overview', {showContacting: true});
    };

    ctrl.addContact = function (userId, name) {
        UserStateService.addContact(userId, name).then(function (type) {
            angular.forEach(ctrl.contacting.users, function (user) {
                if (user.userId === userId) {
                    user.contactOfUser = true;
                }
            });
            ContactStatisticTypes.addContactByName(type);
            ctrl.reloadPinwall();
        });
    };
}];

