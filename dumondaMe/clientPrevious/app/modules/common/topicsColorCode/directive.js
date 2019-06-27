'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                topics: '=',
                isTextExpanded: '='
            },
            templateUrl: 'app/modules/common/topicsColorCode/template.html',
            controller: function () {
            },
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyTopicsColor'
};
