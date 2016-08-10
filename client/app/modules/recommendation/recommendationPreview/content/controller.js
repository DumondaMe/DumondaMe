'use strict';

module.exports = ['$state', function ($state) {
    var ctrl = this;

    ctrl.navToDetail = function () {
        $state.go('page.detail', {label: ctrl.recommendation.label, pageId: ctrl.recommendation.pageId});
    };
}];
