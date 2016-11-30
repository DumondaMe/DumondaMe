'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                topicName: '@'
            },
            templateUrl: 'app/modules/common/topicsColorVerticalCode/topic/template.html',
            controller: require('./controller.js'),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyTopicColorVerticalElement'
};
