'use strict';

module.exports = ['ElyModal', 'DateFormatCheckService', 'CreateEventMessageService', 'moment',
    function (ElyModal, DateFormatCheckService, CreateEventMessageService, moment) {
        var ctrl = this;

        if (ctrl.isEditMode) {
            ctrl.dataOnServer = angular.copy(ctrl.data);
        } else {
            ctrl.data = {};
        }
        ctrl.startTime = "12:00";
        ctrl.startDate = moment().add(1, 'days').toDate();
        ctrl.minDate = moment().add(1, 'days').toDate();

        ctrl.getDateExample = DateFormatCheckService.getDateExample;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.cancelPreviewImage = function () {
            ctrl.selectImage = false;
        };

        ctrl.changeData = function () {
            ctrl.dataHasChanged = !angular.equals(ctrl.dataOnServer, ctrl.data);
        };

        ctrl.dateChanged = function () {

        };

        ctrl.createEvent = function () {
            var message = CreateEventMessageService.getCreateEventMessage(ctrl.data);
            //UploadPageService.uploadCreatePage(message, ctrl);
        };

        ctrl.modifyEvent = function () {
            var message = CreateEventMessageService.getModifyEventMessage(ctrl.data);
            //UploadPageService.uploadModifyPage(message, ctrl);
        };
    }];

