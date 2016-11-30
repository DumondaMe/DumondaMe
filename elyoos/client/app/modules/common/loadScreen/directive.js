'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/common/loadScreen/template.html',
            controller: function () {
            }
        };
    }],
    name: 'elyLoadScreen'
};
