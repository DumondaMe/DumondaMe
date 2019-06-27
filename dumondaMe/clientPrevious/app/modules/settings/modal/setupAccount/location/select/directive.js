'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                requestStarted: '=',
                disableNavigation: '='
            },
            templateUrl: 'app/modules/settings/modal/setupAccount/location/select/template.html'
        };
    }],
    name: 'elySetupAccountSelectLocation'
};
