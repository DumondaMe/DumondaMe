'use strict';

var link = require('./link.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'A',
            scope: {scrollPosition: '='},
            link: link.directiveLink()
        };
    }],
    name: 'scrollPosition'
};
