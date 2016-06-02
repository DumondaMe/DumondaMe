'use strict';

module.exports = ['$state', 'dateFormatter', 'UserDetailNavigation',
    function ($state, dateFormatter, UserDetailNavigation) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

        ctrl.openUserDetail = function () {
            UserDetailNavigation.openUserDetail(ctrl.element.userId, ctrl.element.isAdmin);
        };

        ctrl.openPageDetail = function () {
            $state.go('page.detail', {label: ctrl.element.label, pageId: ctrl.element.pageId});
        };
    }];

