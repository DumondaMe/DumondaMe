'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/navigation/toolbar/search/itemView/page/template.html',
            scope: {},
            controllerAs: 'ctrl',
            bindToController: {
                item: '='
            },
            controller: require('./controller')
        };
    }],
    name: 'elyAutosuggestionPage'
};
