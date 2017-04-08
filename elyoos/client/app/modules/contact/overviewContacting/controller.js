'use strict';

module.exports = ['Contacting', 'ScrollRequest', 'ContactingOverviewResponseHandler',
    function (Contacting, ScrollRequest, ContactingOverviewResponseHandler) {
        var ctrl = this;
        ctrl.users = {contactingUsers: []};

        ScrollRequest.reset('contacting', Contacting.get, ContactingOverviewResponseHandler);

        ctrl.nextContacting = function () {
            ScrollRequest.nextRequest('contacting', ctrl.users.contactingUsers).then(function (users) {
                ctrl.users = users;
            });
        };

        ctrl.nextContacting();
    }];

