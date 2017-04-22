'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                addedEmails: '=',
                cancel: '='
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/addEMailAddress/template.html'
        };
    }],
    name: 'elyImportAddEmailAddress'
};
