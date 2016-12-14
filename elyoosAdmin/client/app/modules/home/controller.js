'use strict';

module.exports =
    ['OverviewRegisteredUser',
        function (OverviewRegisteredUser) {
            var ctrl = this;

            ctrl.loadOverviewRegisteredUser = true;
            ctrl.overviewRegisteredUser = OverviewRegisteredUser.get({skip: 0, maxItems: 3}, function () {
                ctrl.loadOverviewRegisteredUser = false;
            });
        }];
