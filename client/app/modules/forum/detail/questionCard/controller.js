'use strict';

module.exports = ['Categories',
    function (Categories) {
        var ctrl = this;

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;
    }];

