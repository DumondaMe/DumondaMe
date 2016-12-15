'use strict';

module.exports = ['OverviewRegisteredUser', 'dateFormatter',
    function (OverviewRegisteredUser, dateFormatter) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.getTime;

        ctrl.loadOverviewRegisteredUser = true;
        ctrl.overviewRegisteredUser = OverviewRegisteredUser.get({skip: 0, maxItems: 10}, function () {
            ctrl.loadOverviewRegisteredUser = false;
        });
    }];
