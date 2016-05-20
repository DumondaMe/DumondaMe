'use strict';

module.exports = ['$window', 'Categories',
    function ($window, Categories) {
        var ctrl = this;

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;

        ctrl.openLink = function (link) {
            $window.open(link, '_blank');
        };

    }];

