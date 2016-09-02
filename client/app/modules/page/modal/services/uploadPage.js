'use strict';

module.exports = ['fileUpload', 'errorToast', 'ElyModal', function (fileUpload, errorToast, ElyModal) {

    this.uploadCreatePage = function (message, ctrl) {
        ctrl.uploadStarted = true;

        return fileUpload.uploadFileAndJson(ctrl.blob, message, 'api/user/page/create').then(
            function (resp) {
                ctrl.uploadStarted = false;
                ctrl.data.pageId = resp.data.pageId;
                ctrl.data.linkEmbed = resp.data.linkEmbed;
                ctrl.recommendPage = true;
                return resp;
            }, function () {
                ctrl.uploadStarted = false;
                errorToast.showError('Seite konnte nicht hochgeladen werden!');
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
            .error(function () {
                ctrl.uploadStarted = false;
                errorToast.showError('Seite konnte nicht verändert werden!');
            });
    };
}];
