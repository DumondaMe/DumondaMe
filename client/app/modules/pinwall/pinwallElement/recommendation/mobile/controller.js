'use strict';

module.exports = ['$state', 'dateFormatter', 'Categories', 'UserDetailNavigation',
    function ($state, dateFormatter, Categories, UserDetailNavigation) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;

        ctrl.openUserDetail = function () {
            UserDetailNavigation.openUserDetail(ctrl.element.userId, ctrl.element.isAdmin);
        };

        ctrl.openPageDetail = function () {
            $state.go('page.detail', {label: ctrl.element.label, pageId: ctrl.element.pageId});
        };
    }];

