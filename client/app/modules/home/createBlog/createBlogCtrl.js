'use strict';

module.exports = ['dateFormatter', '$mdDialog', function (dateFormatter, $mdDialog) {
    var ctrl = this;
    ctrl.isPublic = true;
    ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

    ctrl.cancel = function() {
        $mdDialog.cancel();
    };
}];

