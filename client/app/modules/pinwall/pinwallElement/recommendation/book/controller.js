'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$mdDialog', '$state', 'dateFormatter', 'Categories', 'UserDetailNavigation',
            function ($mdDialog, $state, dateFormatter, Categories, UserDetailNavigation) {
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
    }
};

