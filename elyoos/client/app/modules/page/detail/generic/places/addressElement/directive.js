'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                addresses: '=',
                isAdmin: '='
            },
            templateUrl: 'app/modules/page/detail/generic/places/addressElement/template.html'
        };
    }],
    name: 'elyPageDetailPlaceElement'
};
