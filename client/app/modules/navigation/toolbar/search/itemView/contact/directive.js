'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/navigation/toolbar/search/itemView/contact/template.html',
            scope: {},
            controllerAs: 'ctrl',
            bindToController: {
                item: '='
            },
            controller: function () {
            }
        };
    }],
    name: 'elyAutosuggestionContact'
};
