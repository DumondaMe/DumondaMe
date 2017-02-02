'use strict';

module.exports = ['ElyModal', 'DateFormatCheckService', 'CreateEventMessageService', 'moment', 'PageEvents', 'errorToast',
    function (ElyModal, DateFormatCheckService, CreateEventMessageService, moment, PageEvents, errorToast) {
        var ctrl = this;

        ctrl.editDateNotAllowed = false;
        if (ctrl.isEditMode) {
            if (moment.unix(ctrl.data.startDate).isBefore(moment().add(1, 'days'))) {
                ctrl.editDateNotAllowed = true;
            }
            ctrl.startTime = moment.unix(ctrl.data.startDate).format('LT');
            ctrl.endTime = moment.unix(ctrl.data.endDate).format('LT');
            ctrl.startDate = moment.unix(ctrl.data.startDate).toDate();
            ctrl.endDate = moment.unix(ctrl.data.endDate).toDate();
            ctrl.minDate = moment().add(1, 'days').toDate();
            ctrl.minEndDate = moment.unix(ctrl.data.startDate).toDate();
            ctrl.addresses = angular.copy(ctrl.addresses);
            var addAddress = true, index = 0;
            ctrl.addresses.forEach(function (address, indexArray) {
                if (address.addressId === ctrl.actualAddress.addressId) {
                    addAddress = false;
                    index = indexArray;
                }
            });
            if (addAddress) {
                ctrl.addresses.unshift(ctrl.actualAddress);
            }
            ctrl.data.selectedAddress = ctrl.addresses[index];
            ctrl.dataOnServer = angular.copy(ctrl.data);
        } else {
            ctrl.data = {};
            ctrl.startTime = "12:00";
            ctrl.endTime = "13:00";
            ctrl.startDate = moment().add(1, 'days').toDate();
            ctrl.endDate = moment().add(1, 'days').toDate();
            ctrl.minDate = moment().add(1, 'days').toDate();
            ctrl.minEndDate = moment().add(1, 'days').toDate();
        }
        ctrl.commandsEndDate = {};

        ctrl.getDateExample = DateFormatCheckService.getDateExample;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.cancelPreviewImage = function () {
            ctrl.selectImage = false;
        };

        ctrl.changeData = function () {
            var tempData = angular.copy(ctrl.data);
            if (moment.isMoment(tempData.startDate) && moment.isMoment(tempData.endDate)) {
                tempData.startDate = Math.floor(tempData.startDate.valueOf() / 1000);
                tempData.endDate = Math.floor(tempData.endDate.valueOf() / 1000);
                ctrl.dataHasChanged = !angular.equals(ctrl.dataOnServer, tempData);
            }
        };

        ctrl.startDateChanged = function (startDate) {
            ctrl.data.startDate = startDate;
            ctrl.minEndDate = startDate.toDate();
            ctrl.dateChanged();
            if (moment.isMoment(ctrl.data.endDate) && ctrl.data.endDate.isBefore(startDate)) {
                ctrl.commandsEndDate.dateDayChanged(startDate.toDate());
            }
        };

        ctrl.endDateChanged = function (endDate) {
            ctrl.data.endDate = endDate;
            ctrl.dateChanged();
        };

        ctrl.dateChanged = function () {
            if (moment.isMoment(ctrl.data.endDate) && moment.isMoment(ctrl.data.startDate) && ctrl.data.endDate.isBefore(ctrl.data.startDate)) {
                ctrl.manageEventForm.endTime.$setValidity('ely-custom-message', false);
            } else if (ctrl.manageEventForm.endTime) {
                ctrl.manageEventForm.endTime.$setValidity('ely-custom-message', true);
            }
            ctrl.changeData();
        };

        ctrl.closeAddPlace = function () {
            ctrl.showAddPlace = false;
        };

        ctrl.placeSelected = function (selectedPlace, description) {
            ctrl.showAddPlace = false;
            ctrl.addedPlace = selectedPlace;
            selectedPlace.description = description;
            ctrl.data.selectedAddress = selectedPlace;
            ctrl.changeData();
        };

        ctrl.createEvent = function () {
            var message = CreateEventMessageService.getCreateEventMessage(ctrl.data, ctrl.genericPageId);
            PageEvents.save(message, function (resp) {
                var event = {eventId: resp.eventId, address: resp.address};
                event.title = ctrl.data.title;
                event.description = ctrl.data.description;
                event.startDate = Math.floor(ctrl.data.startDate.valueOf() / 1000);
                event.endDate = Math.floor(ctrl.data.endDate.valueOf() / 1000);
                ElyModal.hide(event);
            }, function () {
                errorToast.showError('Das Erstellen einer Veranstaltung ist fehlgeschlagen.');
            });
        };

        ctrl.modifyEvent = function () {
            var message = CreateEventMessageService.getModifyEventMessage(ctrl.data, ctrl.eventId);
            PageEvents.save(message, function (resp) {
                var event = {eventId: ctrl.eventId, address: resp.address};
                event.title = ctrl.data.title;
                event.description = ctrl.data.description;
                event.startDate = Math.floor(ctrl.data.startDate.valueOf() / 1000);
                event.endDate = Math.floor(ctrl.data.endDate.valueOf() / 1000);
                ElyModal.hide(event);
            }, function () {
                errorToast.showError('Das Verändern einer Veranstaltung ist fehlgeschlagen.');
            });
        };
    }];

