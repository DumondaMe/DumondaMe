'use strict';

module.exports = ['dateFormatter', '$mdDialog', '$state', function (dateFormatter, $mdDialog, $state) {
    var ctrl = this;
    ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

    ctrl.cancel = function() {
        $mdDialog.cancel();
    };

    ctrl.openUserDetail = function () {
        $mdDialog.cancel();
        $state.go('user.detail', {userId: ctrl.element.userId});
    };
}];

