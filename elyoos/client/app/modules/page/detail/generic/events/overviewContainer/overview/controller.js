'use strict';

module.exports = ['EventOverview', '$stateParams', 'dateFormatter', 'moment', 'PageEvents', 'ArrayHelper', 'errorToast', '$mdDialog',
    function (EventOverview, $stateParams, dateFormatter, moment, PageEvents, ArrayHelper, errorToast, $mdDialog) {
        var ctrl = this;

        ctrl.getTime = dateFormatter.getTime;

        ctrl.getEndDate = function (startDate, endDate) {
            if (moment.unix(startDate).isBetween(moment.unix(endDate).startOf('day'), moment.unix(endDate).endOf('day'))) {
                return ctrl.getTime(endDate, 'LT');
            }
            return ctrl.getTime(endDate, 'l LT');
        };

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
                }, function () {
                    errorToast.showError("Fehler beim Löschen des Events");
                });
            });
        };

        if(ctrl.commands) {
            ctrl.commands.addEvent = function (event) {
                ctrl.events.events.unshift(event);
            };
        }

        ctrl.events = EventOverview.get({skip: 0, maxItems: 10, actual: ctrl.isActual === 'true', pageId: $stateParams.pageId});
    }];

