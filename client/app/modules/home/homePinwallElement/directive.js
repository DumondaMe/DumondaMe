'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                element: '='
            },
            templateUrl: 'app/modules/home/homePinwallElement/template.html'
        };
    }],
    name: 'elyHomePinwallElement'
};
