'use strict';

module.exports = ['fileUpload', 'errorToast', 'ElyModal', function (fileUpload, errorToast, ElyModal) {

    this.uploadCreatePage = function (message, ctrl) {
        ctrl.uploadStarted = true;

        fileUpload.uploadFileAndJson(ctrl.blob, message, 'api/user/page/create')
            .success(function (resp) {
                ctrl.uploadStarted = false;
                ctrl.pageId = resp.pageId;
                ctrl.recommendPage = true;
            })
            .error(function () {
                ctrl.uploadStarted = false;
                errorToast.showError('Seite konnte nicht hochgeladen werden!');
            });
    };

    this.uploadModifyPage = function (message, ctrl) {
        ctrl.uploadStarted = true;

        fileUpload.uploadFileAndJson(ctrl.blob, message, 'api/user/page/edit')
            .success(function () {
                ElyModal.hide(ctrl.data);
            })
            .error(function () {
                ctrl.uploadStarted = false;
                errorToast.showError('Seite konnte nicht verändert werden!');
            });
    };
}];
