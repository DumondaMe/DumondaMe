'use strict';

var link = require('./link.js');

module.exports = {
    directive: ['$animate', function ($animate) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: 'app/modules/common/stepperDialog/template.html',
            scope: {},
            bindToController: {
                finishLabel: '@',
                disableDialogContent: '='
            },
            controller: require('./controller'),
            link: link.directiveLink($animate),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyStepperDialog'
};
