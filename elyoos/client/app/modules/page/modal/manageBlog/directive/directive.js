'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            require: '^elyStepperDialog',
            transclude: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                isEditMode:'=',
                eventDataChanged: '=',
                eventShowPrivacy: '=',
                setVisibility: '=',
                data: '='
            },
            templateUrl: 'app/modules/page/modal/manageBlog/directive/template.html'
        };
    }],
    name: 'elyManageBlog'
};
