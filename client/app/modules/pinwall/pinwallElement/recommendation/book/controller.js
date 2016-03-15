'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$mdDialog', 'dateFormatter', 'Categories', 'UserDetailNavigation',
            function ($mdDialog, dateFormatter, Categories, UserDetailNavigation) {
                var ctrl = this;

                ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

                ctrl.getCategory = Categories.getCategory;

                ctrl.openUserDetail = function () {
                    UserDetailNavigation.openUserDetail(ctrl.element.userId, ctrl.element.isAdmin);
                };

                ctrl.getCategoryClass = function (category) {
                    var categoryClass = {};
                    categoryClass[category] = true;
                    return categoryClass;
                };
            }];
    }
};

