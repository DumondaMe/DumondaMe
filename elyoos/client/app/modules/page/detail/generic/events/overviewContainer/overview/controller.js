'use strict';

module.exports = ['EventOverview', '$stateParams', 'dateFormatter', 'moment',
    function (EventOverview, $stateParams, dateFormatter, moment) {
        var ctrl = this;

        ctrl.getTime = dateFormatter.getTime;

        ctrl.getEndDate = function (startDate, endDate) {
            if(moment.unix(startDate).isBetween(moment.unix(endDate).startOf('day'), moment.unix(endDate).endOf('day'))) {
                return ctrl.getTime(endDate, 'LT');
            }
            return ctrl.getTime(endDate, 'l LT');
        };

        ctrl.events = EventOverview.get({skip: 0, maxItems: 10, actual: ctrl.isActual === 'true', pageId: $stateParams.pageId});
    }];

