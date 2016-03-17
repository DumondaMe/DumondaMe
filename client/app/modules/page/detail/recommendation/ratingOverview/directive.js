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
                onlyContact: '=',
                commands: '='
            },
            templateUrl: 'app/modules/page/detail/recommendation/ratingOverview/template.html'
        };
    }],
    name: 'elyPageDetailRatingOverview'
};
