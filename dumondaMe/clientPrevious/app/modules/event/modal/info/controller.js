'use strict';

module.exports = ['ElyModal', 'EventDetail', 'dateFormatter', 'Link', '$state',
    function (ElyModal, EventDetail, dateFormatter, Link, $state) {
        var ctrl = this;

        ctrl.getTime = dateFormatter.getTime;
        ctrl.getEndDate = dateFormatter.getEndDate;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.openLink = Link.open;

        ctrl.goToPageDetail = function () {
            ElyModal.cancel();
            $state.go('page.detail', {label: 'Generic', pageId: ctrl.event.pageId});
        };

        ctrl.event = EventDetail.get({eventId: ctrl.eventId});
    }];
