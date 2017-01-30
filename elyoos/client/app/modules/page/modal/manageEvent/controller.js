'use strict';

module.exports = ['ElyModal', 'DateFormatCheckService', 'CreateEventMessageService', 'moment', 'PageEvents', 'errorToast',
    function (ElyModal, DateFormatCheckService, CreateEventMessageService, moment, PageEvents, errorToast) {
        var ctrl = this;

        if (ctrl.isEditMode) {
            ctrl.dataOnServer = angular.copy(ctrl.data);
        } else {
            ctrl.data = {};
        }
        ctrl.startTime = "12:00";
        ctrl.startDate = moment().add(1, 'days').toDate();
        ctrl.endDate = moment().add(1, 'days').toDate();
        ctrl.minDate = moment().add(1, 'days').toDate();
        ctrl.minEndDate = moment().add(1, 'days').toDate();
        ctrl.commandsEndDate = {};

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

        ctrl.startDateChanged = function (startDate) {
            ctrl.data.startDate = startDate;
            ctrl.minEndDate = startDate.toDate();
            ctrl.dateChanged();
            if(ctrl.data.endDate && ctrl.data.endDate.isBefore(startDate)) {
                ctrl.commandsEndDate.dateDayChanged(startDate.toDate());
            }
        };

        ctrl.endDateChanged = function (endDate) {
            ctrl.data.endDate = endDate;
            ctrl.dateChanged();
        };

        ctrl.dateChanged = function () {
            if (ctrl.data.endDate && ctrl.data.startDate && ctrl.data.endDate.isBefore(ctrl.data.startDate)) {
                ctrl.manageEventForm.endTime.$setValidity('ely-custom-message', false);
            } else if (ctrl.manageEventForm.endTime) {
                ctrl.manageEventForm.endTime.$setValidity('ely-custom-message', true);
            }
        };

        ctrl.closeAddPlace = function () {
            ctrl.showAddPlace = false;
        };

        ctrl.placeSelected = function (selectedPlace) {
            ctrl.showAddPlace = false;
            ctrl.addedPlace = selectedPlace;
            ctrl.data.selectedAddress = selectedPlace;
        };

        ctrl.createEvent = function () {
            var message = CreateEventMessageService.getCreateEventMessage(ctrl.data, ctrl.genericPageId);
            PageEvents.save(message, function (resp) {
                var event = {eventId: resp.eventId, where: resp.where};
                event.title = ctrl.data.title;
                event.startDate = Math.floor(ctrl.data.startDate.valueOf() / 1000);
                event.endDate = Math.floor(ctrl.data.endDate.valueOf() / 1000);
                ElyModal.hide(event);
            }, function () {
                errorToast.showError('Das erstellen einer Veranstaltung ist fehlgeschlagen.');
            });
        };

        ctrl.modifyEvent = function () {
            var message = CreateEventMessageService.getModifyEventMessage(ctrl.data);
            //UploadPageService.uploadModifyPage(message, ctrl);
        };
    }];

