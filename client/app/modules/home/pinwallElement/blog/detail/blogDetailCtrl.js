'use strict';

module.exports = ['dateFormatter', '$mdDialog', function (dateFormatter, $mdDialog) {
    var ctrl = this;
    ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

    ctrl.cancel = function() {
        $mdDialog.cancel();
    };
}];

