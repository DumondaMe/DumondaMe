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
                dialogTitle: '@',
                dialogSearchPlaceholder: '@',
                onBack: '&',
                onSelected: '=',
                overviewService: '=',
                suggestionService: '='
            },
            templateUrl: 'app/modules/common/selectElements/template.html'
        };
    }],
    name: 'elySelectElements'
};
