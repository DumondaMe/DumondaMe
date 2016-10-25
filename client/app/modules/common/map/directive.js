'use strict';

var link = require('./link.js');

module.exports = {
    directive: ['$timeout', 'elyHelper', function ($timeout, elyHelper) {
        return {
            restrict: 'E',
            replace: true,
            scope: {center: '=', markerCenter: '@', zoom: '='},
            templateUrl: 'app/modules/common/map/template.html',
            controller: require('./controller.js'),
            link: link.directiveLink($timeout, elyHelper),
            controllerAs: 'ctrl',
            bindToController: {}
        };
    }],
    name: 'elyMap'
};
