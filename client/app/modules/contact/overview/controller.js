'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ScrollRequest', 'Contact', 'ContactOverviewResponseHandler',
            function (ScrollRequest, Contact, ContactOverviewResponseHandler) {
                var ctrl = this;

                ctrl.overview = {contacts: []};

                ScrollRequest.reset('ContactOverview', Contact.get, ContactOverviewResponseHandler);

                ctrl.nextOverview = function () {
                    ScrollRequest.nextRequest('ContactOverview', ctrl.overview.contacts).then(function (overview) {
                        ctrl.overview = overview;
                    });
                };

                ctrl.nextOverview();
            }];
    }
};

