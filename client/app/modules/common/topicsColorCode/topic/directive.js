'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                topics: '=',
                topicName: '@'
            },
            templateUrl: 'app/modules/common/topicsColorCode/topic/template.html',
            controller: require('./controller.js'),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyTopicColorElement'
};
