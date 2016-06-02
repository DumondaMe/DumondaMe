'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/common/topics/template.html',
            scope: {},
            bindToController: {
                topics: '=',
                label: '='
            },
            controller: require('./controller'),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyTopics'
};
