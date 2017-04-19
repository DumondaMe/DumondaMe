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
                importStarted: '=',
                importFinish: '=',
                contacts: '=',
                deactivate: '='
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/importGmail/template.html'
        };
    }],
    name: 'elyImportGmail'
};
