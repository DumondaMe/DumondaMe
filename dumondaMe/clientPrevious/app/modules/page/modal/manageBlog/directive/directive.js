'use strict';

var link = require('./link.js');

module.exports = {
    directive: ['$animate', function ($animate) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            link: link.directiveLink($animate),
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                isEditMode:'=',
                eventDataChanged: '=',
                eventImageLoad: '=',
                eventShowPrivacy: '=',
                setVisibility: '=',
                data: '='
            },
            templateUrl: 'app/modules/page/modal/manageBlog/directive/template.html'
        };
    }],
    name: 'elyManageBlog'
};
