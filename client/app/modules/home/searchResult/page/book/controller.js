'use strict';

module.exports = ['$state', 'Categories', function ($state, Categories) {
    var ctrl = this;

    ctrl.getCategory = Categories.getCategory;
    ctrl.getCategoryClass = Categories.getCategoryClass;

    ctrl.goToDetail = function () {
        $state.go('page.detail', {label: ctrl.page.label, pageId: ctrl.page.pageId});
    };
}];

