'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ScrollRequest', 'Contact', 'ContactOverviewResponseHandler',
            function (ScrollRequest, Contact, ContactOverviewResponseHandler) {
                var ctrl = this;
                var scrollRequestName = 'ContactOverview' + ctrl.title;
                var requestedContacts = false;
                ctrl.overview = {contacts: []};
                ctrl.isExpanded = false;

                ctrl.toggleExpand = function () {
                    if (!requestedContacts && !ctrl.isExpanded) {
                        requestedContacts = true;
                        ctrl.isExpanded = true;
                        ctrl.nextOverview();
                    } else {
                        ctrl.isExpanded = !ctrl.isExpanded;
                    }
                };

                ScrollRequest.reset(scrollRequestName, Contact.get, ContactOverviewResponseHandler);

                ctrl.nextOverview = function () {
                    var params;
                    if (ctrl.title) {
                        params = {types: [ctrl.title]};
                    }
                    ScrollRequest.nextRequest(scrollRequestName, ctrl.overview.contacts, params).then(function (overview) {
                        ctrl.overview = overview;
                    });
                };
            }];
    }
};

