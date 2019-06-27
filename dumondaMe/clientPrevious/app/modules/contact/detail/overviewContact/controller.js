'use strict';

module.exports = ['ScrollRequest', '$stateParams', 'OverviewContactScrollRequestResponseHandler',
    function (ScrollRequest, $stateParams, OverviewContactScrollRequestResponseHandler) {
        var ctrl = this;
        ctrl.user = {users: []};
        ctrl.loadRunning = true;

        ScrollRequest.reset('UserDetailContactHandling', ctrl.service.get, OverviewContactScrollRequestResponseHandler);

        ctrl.commands.next = function () {
            ScrollRequest.nextRequest('UserDetailContactHandling', ctrl.user.users, {userId: $stateParams.userId}).then(function (users) {
                ctrl.user = users;
                ctrl.loadRunning = false;
            });
        };

        ctrl.commands.next();
    }];
