'use strict';

module.exports = ['OverviewRegisteredUser', 'dateFormatter', 'ScrollRequest', 'OverviewUserScrollRequestResponseHandler',
    function (OverviewRegisteredUser, dateFormatter, ScrollRequest, OverviewUserScrollRequestResponseHandler) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.getTime;

        ctrl.loadOverviewRegisteredUser = true;
        ctrl.overviewRegisteredUser = {user: []};

        ScrollRequest.reset('OverviewRegisteredUser', OverviewRegisteredUser.get, OverviewUserScrollRequestResponseHandler);

        ctrl.nextUser = function () {
            ScrollRequest.nextRequest('OverviewRegisteredUser', ctrl.overviewRegisteredUser.user).then(function (user) {
                ctrl.loadOverviewRegisteredUser = false;
                ctrl.overviewRegisteredUser = user;
            });
        };
        ctrl.nextUser();
    }];
