'use strict';

var link = require('./link.js');

module.exports = {
    directive: ['$timeout', 'elyHelper', function ($timeout, elyHelper) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                center: '=',
                defaultCenter: '=',
                markerCenter: '@',
                zoom: '=',
                defaultZoom: '='
            },
            templateUrl: 'app/modules/common/map/template.html',
            controller: require('./controller.js'),
            link: link.directiveLink($timeout, elyHelper),
            controllerAs: 'ctrl',
            bindToController: {}
        };
    }],
    name: 'elyMap'
};
