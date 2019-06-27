'use strict';

module.exports = ['$state', function ($state) {
    var ctrl = this;

    ctrl.goToDetail = function () {
        $state.go('page.detail', {label: ctrl.page.label, pageId: ctrl.page.pageId});
    };
}];

