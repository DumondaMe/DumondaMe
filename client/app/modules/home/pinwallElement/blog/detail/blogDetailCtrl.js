'use strict';

module.exports = ['dateFormatter', 'ElyModal', '$state', function (dateFormatter, ElyModal, $state) {
    var ctrl = this;
    ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

    ctrl.cancel = function() {
        ElyModal.cancel();
    };

    ctrl.openUserDetail = function () {
        ElyModal.cancel();
        $state.go('user.detail', {userId: ctrl.element.userId});
    };
}];

