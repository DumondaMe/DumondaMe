'use strict';

module.exports = ['$window', 'Categories', 'Link',
    function ($window, Categories, Link) {
        var ctrl = this;

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;

        ctrl.openLink = Link.open;

    }];

