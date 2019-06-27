'use strict';

module.exports = ['EventPageDetailOverview', '$stateParams', 'dateFormatter', 'moment', 'PageEvents', 'ArrayHelper', 'errorToast', '$mdDialog',
    'ElyModal', 'ScrollRequest', 'PageEventsScrollRequestResponseHandler',
    function (EventPageDetailOverview, $stateParams, dateFormatter, moment, PageEvents, ArrayHelper, errorToast, $mdDialog, ElyModal, ScrollRequest,
              PageEventsScrollRequestResponseHandler) {
        var ctrl = this;

        ctrl.scrollName = 'genericPageEventOverview' + ctrl.isActual;
        ctrl.events = {events: []};
        ctrl.getTime = dateFormatter.getTime;
        ctrl.getEndDate = dateFormatter.getEndDate;

        ScrollRequest.reset(ctrl.scrollName, EventPageDetailOverview.get, PageEventsScrollRequestResponseHandler, 5);

        ctrl.deleteEvent = function (eventToDelete) {
            var confirm = $mdDialog.confirm()
                .title("Veranstaltung " + eventToDelete.title + " löschen")
                .textContent("Willst Du diese Veranstaltung wirklich löschen?")
                .ariaLabel("Delete Event")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                PageEvents.delete({eventId: eventToDelete.eventId}, function () {
                    ArrayHelper.removeElement(ctrl.events.events, 'eventId', eventToDelete.eventId);
                    ctrl.hasEvents(ctrl.events.events.length > 0);
                }, function () {
                    errorToast.showError("Fehler beim Löschen des Events");
                });
            });
        };

        ctrl.editEvent = function (eventToEdit, index) {
            ElyModal.show('ManageEventCtrl', 'app/modules/page/modal/manageEvent/template.html', {
                isEditMode: true, eventId: eventToEdit.eventId, addresses: ctrl.addresses, actualAddress: eventToEdit.address,
                data: {
                    title: eventToEdit.title, description: eventToEdit.description, startDate: eventToEdit.startDate, endDate: eventToEdit.endDate
                }
            }).then(function (resp) {
                ctrl.events.events[index] = resp;
            });
        };

        ctrl.openEventInfo = function (eventId) {
            ElyModal.show('InfoEventCtrl', 'app/modules/event/modal/info/template.html',
                {eventId: eventId});
        };

        ctrl.nextEvents = function () {
            ScrollRequest.nextRequest(ctrl.scrollName, ctrl.events.events, {
                actual: ctrl.isActual === 'true', pageId: $stateParams.pageId
            }).then(function (events) {
                ctrl.events = events;
                ctrl.hasMoreEvents = ScrollRequest.hasNext(ctrl.scrollName);
                ctrl.hasEvents(ctrl.events.events.length > 0);
            });
        };

        if (ctrl.commands) {
            ctrl.commands.addEvent = function (event) {
                ctrl.events.events.unshift(event);
                ctrl.hasEvents(ctrl.events.events.length > 0);
            };
        }

        ctrl.nextEvents();
    }];

