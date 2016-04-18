'use strict';

var link = require('./link.js');

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/common/loadImageButton/template.html',
            controller: function () {},
            link: link.directiveLink(),
            controllerAs: 'ctrl',
            bindToController: {
                imageForUpload: '=',
                ariaLabel: '@',
                icon: '@'
            }
        };
    }],
    name: 'elyLoadImageButton'
};
