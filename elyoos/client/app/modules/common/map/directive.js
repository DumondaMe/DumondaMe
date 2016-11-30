'use strict';

var link = require('./link.js');

module.exports = {
    directive: ['$timeout', 'elyHelper', 'MapChangeHandler', 'MapMarker', 'MapCenter',
        function ($timeout, elyHelper, MapChangeHandler, MapMarker, MapCenter) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    commands: '=',
                    center: '=',
                    defaultCenter: '=',
                    hasMarkerCenter: '@',
                    zoom: '=',
                    defaultZoom: '=',
                    onMapChange: '='
                },
                templateUrl: 'app/modules/common/map/template.html',
                controller: require('./controller.js'),
                link: link.directiveLink($timeout, elyHelper, MapChangeHandler, MapMarker, MapCenter),
                controllerAs: 'ctrl',
                bindToController: {}
            };
        }],
    name: 'elyMap'
};
