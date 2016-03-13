'use strict';

module.exports = ['ElyModal', 'DateFormatCheckService',
    function (ElyModal, DateFormatCheckService) {
        var ctrl = this;
        ctrl.selectImage = false;

        ctrl.getDateExample = DateFormatCheckService.getDateExample;

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
    }];

