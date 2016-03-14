'use strict';

module.exports = ['ElyModal', 'DateFormatCheckService', 'Categories', 'BookPageCreateMessageService', 'fileUpload', 'errorToast',
    function (ElyModal, DateFormatCheckService, Categories, BookPageCreateMessageService, fileUpload, errorToast) {
        var ctrl = this;
        ctrl.selectImage = false;
        ctrl.recommendPage = false;

        ctrl.getDateExample = DateFormatCheckService.getDateExample;
        ctrl.categories = Categories.categories;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.cancelPreviewImage = function () {
            ctrl.selectImage = false;
        };

        ctrl.setPreviewImage = function (blob, dataUri) {
            ctrl.selectImage = false;
            ctrl.dataUri = dataUri;
            ctrl.blob = blob;
        };

        ctrl.publishDateChanged = function () {
            if (ctrl.publishDate && ctrl.publishDate.trim() !== "") {
                ctrl.createBookPageForm.publishDate.$setValidity('ely-date', DateFormatCheckService.isDateValid(ctrl.publishDate));
            } else {
                ctrl.createBookPageForm.publishDate.$setValidity('ely-date', true);
            }
        };

        ctrl.createBook = function () {
            var message = BookPageCreateMessageService.getCreateBookPageMessage(ctrl);
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

        ctrl.recommendationFinish = function () {
            ElyModal.hide();
        };
    }];

