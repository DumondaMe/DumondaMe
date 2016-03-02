'use strict';

module.exports = ['dateFormatter', 'ElyModal', 'UserDetailNavigation', function (dateFormatter, ElyModal, UserDetailNavigation) {
    var ctrl = this;
    ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

    ctrl.cancel = function() {
        ElyModal.cancel();
    };

    ctrl.openUserDetail = function () {
        ElyModal.cancel();
        UserDetailNavigation.openUserDetail(ctrl.element.userId, ctrl.element.isAdmin);
    };
}];

