'use strict';

var compile = require('./compile.js');

module.exports = {
    directive: ['Bowser', function (Bowser) {
        return {
            priority: 1001,
            replace: false,
            restrict: 'A',
            compile: compile.compile(Bowser)
        };
    }],
    name: 'elyHandlingFlex'
};
