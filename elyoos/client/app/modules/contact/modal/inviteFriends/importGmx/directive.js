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
                openBasicAuth: '='
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/importGmx/template.html'
        };
    }],
    name: 'elyImportGmx'
};
