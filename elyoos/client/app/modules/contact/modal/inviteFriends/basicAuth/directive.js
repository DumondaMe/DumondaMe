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
                serviceName: '@',
                service: '=',
                contacts: '=',
                finish: '=',
                loadAddressBookEvent: '=',
                importStarted: '='
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/basicAuth/template.html'
        };
    }],
    name: 'elyImportBasicAuth'
};
