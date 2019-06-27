'use strict';

var link = require('./link.js');

module.exports = {
    directive: ['$timeout', 'elyHelper', 'MapChangeHandler', 'MapMarker', 'MapCenter', 'MapView', 'MapDistanceCalculator',
        function ($timeout, elyHelper, MapChangeHandler, MapMarker, MapCenter, MapView, MapDistanceCalculator) {
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
                    onMapChange: '=',
                    mapInit: '='
                },
                templateUrl: 'app/modules/common/map/template.html',
                controller: function () {
                },
                link: link.directiveLink($timeout, elyHelper, MapChangeHandler, MapMarker, MapCenter, MapView, MapDistanceCalculator),
                controllerAs: 'ctrl',
                bindToController: {}
            };
        }],
    name: 'elyMap'
};
