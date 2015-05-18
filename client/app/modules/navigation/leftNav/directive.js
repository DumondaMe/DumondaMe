'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                sections: '='
            },
            templateUrl: 'app/modules/navigation/leftNav/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyLeftNav'
};
