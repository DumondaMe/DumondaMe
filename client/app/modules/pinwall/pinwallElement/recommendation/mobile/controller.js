'use strict';

module.exports = ['$state', 'dateFormatter', 'UserDetailNavigation', 'ElyModal',
    function ($state, dateFormatter, UserDetailNavigation, ElyModal) {
        var ctrl = this;

        ctrl.requestRunning = false;
        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

        ctrl.openUserDetail = function () {
            UserDetailNavigation.openUserDetail(ctrl.element.userId, ctrl.element.isAdmin);
        };

        ctrl.openPageDetail = function () {
            if(ctrl.element.label !== 'Blog' && ctrl.element.pinwallType !== 'Blog') {
                $state.go('page.detail', {label: ctrl.element.label, pageId: ctrl.element.pageId});
            } else {
                ElyModal.show('HomePinwallBlogDetail', 'app/modules/pinwall/pinwallElement/blog/detail/detail.html', {element: ctrl.element});
            }
        };
    }];

