'use strict';

module.exports = ['dateFormatter', 'ElyModal', function (dateFormatter, ElyModal) {
    var ctrl = this;

    ctrl.getTime = dateFormatter.getTime;
    ctrl.getEndDate = dateFormatter.getEndDate;

    ctrl.openEventInfo = function () {
        ElyModal.show('InfoEventCtrl', 'app/modules/event/modal/info/template.html',
            {eventId: ctrl.event.eventId});
    };
}];

