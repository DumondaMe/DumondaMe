'use strict';

var link = require('./link.js');

module.exports = {
    directive: [ '$timeout', '$window', function ($timeout, $window) {
        return {
            restrict: 'A',
            scope: {elyHeight: '='},
            link: link.directiveLink($timeout, $window)
        };
    }],
    name: 'elyHeight'
};
