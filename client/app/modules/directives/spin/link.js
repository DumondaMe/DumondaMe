'use strict';

var Spinner = require('spin');

module.exports = {
    directiveLink: function () {
        return function ($scope, element) {
            var opts = {
                lines: 11,
                length: 10,
                width: 4,
                radius: 13,
                corners: 1,
                rotate: 11,
                direction: 1,
                color: '#00796B',
                speed: 1.2,
                trail: 60,
                shadow: false,
                hwaccel: false,
                className: 'spinner',
                zIndex: 2e9,
                top: '50%',
                left: '50%'
            }, spinElement, spinner;

            if ($scope.size === 'small') {
                opts.lines = 9;
                opts.length = 5;
                opts.width = 3;
                opts.radius = 4;
            }

            spinElement = element.find('#spinner-content');
            spinner = new Spinner(opts).spin();
            spinElement.append(spinner.el);
        };
    }
};
