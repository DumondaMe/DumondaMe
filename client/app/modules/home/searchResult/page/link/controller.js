'use strict';

module.exports = ['$state', 'Categories', function ($state, Categories) {
    var ctrl = this;

    ctrl.getCategory = Categories.getCategory;
    ctrl.getCategoryClass = Categories.getCategoryClass;
}];

