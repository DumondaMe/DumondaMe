'use strict';

var reduceCount = function (ctrl) {
    if (ctrl.count > 0) {
        ctrl.count = ctrl.count - 1;
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['ScrollRequest', 'Contact', 'ContactOverviewResponseHandler', 'UserStateService', 'GroupSettingsService',
            function (ScrollRequest, Contact, ContactOverviewResponseHandler, UserStateService, GroupSettingsService) {
                var ctrl = this;
                var scrollRequestName = 'ContactOverview' + ctrl.statistic.type;
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
                    if (ctrl.statistic.type) {
                        params = {types: [ctrl.statistic.type]};
                    }
                    ScrollRequest.nextRequest(scrollRequestName, ctrl.overview.contacts, params).then(function (overview) {
                        ctrl.overview = overview;
                    });
                };

                ctrl.changeGroupName = function () {

                };

                ctrl.deleteGroup = function () {
                    GroupSettingsService.deleteGroup(ctrl.statistic.type, ctrl.statistic.count);
                };

                ctrl.openGroupSetting = function () {

                };

                ctrl.blockContact = function (contactId) {
                    UserStateService.blockContact(contactId).then(function () {
                        UserStateService.removeContact(ctrl.overview.contacts, contactId);
                        ScrollRequest.removedElement(scrollRequestName);
                        reduceCount(ctrl);
                    });
                };

                ctrl.deleteContact = function (contactId) {
                    UserStateService.deleteContact(contactId).then(function () {
                        UserStateService.removeContact(ctrl.overview.contacts, contactId);
                        ScrollRequest.removedElement(scrollRequestName);
                        reduceCount(ctrl);
                    });
                };
            }];
    }
};

