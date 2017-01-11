'use strict';

module.exports = ['dateFormatter', '$mdDialog', 'Blog', 'errorToast', 'PreviewTextService', 'UserDetailNavigation',
    function (dateFormatter, $mdDialog, Blog, errorToast, PreviewTextService, UserDetailNavigation) {
        var ctrl = this;

        ctrl.requestRunning = false;
        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.previewText = PreviewTextService.getPreviewText(ctrl.element.text, 120).text;

        ctrl.openUserDetail = function () {
            UserDetailNavigation.openUserDetail(ctrl.element.userId, ctrl.element.isAdmin);
        };
    }];
