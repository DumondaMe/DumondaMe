'use strict';

module.exports = ['fileUpload', 'errorToast', 'ElyModal', function (fileUpload, errorToast, ElyModal) {

    this.uploadCreatePage = function (message, ctrl) {
        ctrl.uploadStarted = true;

        return fileUpload.uploadFileAndJson(ctrl.blob, message, 'api/user/page/create').then(
            function (resp) {
                ElyModal.hide(resp.data);
            }, function (resp) {
                ctrl.uploadStarted = false;
                if (resp.data && resp.data.errorCode === 2) {
                    errorToast.showError('Das Bild ist zu klein! Seite wurde nicht erstellt.');
                } else {
                    errorToast.showError('Beitrag konnte nicht erstellt!');
                }
            });
    };

    this.uploadModifyPage = function (message, ctrl) {
        ctrl.uploadStarted = true;

        fileUpload.uploadFileAndJson(ctrl.blob, message, 'api/user/page/edit')
            .success(function (resp) {
                ctrl.data.linkEmbed = resp.linkEmbed;
                ctrl.data.linkHistory = resp.linkHistory;
                ctrl.data.linkHistoryDate = resp.linkHistoryDate;
                ElyModal.hide(ctrl.data);
            })
            .error(function (resp) {
                ctrl.uploadStarted = false;
                if (resp.data && resp.data.errorCode === 2) {
                    errorToast.showError('Das Bild ist zu klein! Seite wurde nicht verändert.');
                } else {
                    errorToast.showError('Beitrag konnte nicht verändert werden!');
                }
            });
    };
}];
