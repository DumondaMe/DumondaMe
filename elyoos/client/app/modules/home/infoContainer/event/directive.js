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
                event: '='
            },
            templateUrl: 'app/modules/home/infoContainer/event/template.html'
        };
    }],
    name: 'elyHomeInfoContainerEvent'
};
