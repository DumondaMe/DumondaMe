'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {popularPlaces: '='},
            templateUrl: 'app/modules/map/overviewRecommendations/template.html'
        };
    }],
    name: 'elyMapOverviewRecommendations'
};
