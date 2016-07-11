'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                topics: '='
            },
            templateUrl: 'app/modules/common/topicsColorVerticalCode/template.html',
            controller: function () {
            },
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyTopicsVerticalColor'
};
