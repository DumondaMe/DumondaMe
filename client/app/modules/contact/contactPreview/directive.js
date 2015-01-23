'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/contact/contactPreview/template.html'
        };
    }],
    name: 'elyContactPreview'
};
