'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ScrollRequest', 'Contact', 'ContactOverviewResponseHandler', 'UserStateService', 'GroupSettingsService', 'ContactStatisticTypes',
            function (ScrollRequest, Contact, ContactOverviewResponseHandler, UserStateService, GroupSettingsService, ContactStatisticTypes) {
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
                    var params = {types: [ctrl.statistic.type]};
                    ScrollRequest.nextRequest(scrollRequestName, ctrl.overview.contacts, params).then(function (overview) {
                        ctrl.overview = overview;
                    });
                };

                ctrl.statistic.reloadContact = function () {
                    ctrl.overview = {contacts: []};
                    ScrollRequest.reset(scrollRequestName, Contact.get, ContactOverviewResponseHandler);
                    ctrl.nextOverview();
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
                        ContactStatisticTypes.removeContact(ctrl.statistic);
                    });
                };

                ctrl.deleteContact = function (contactId) {
                    UserStateService.deleteContact(contactId).then(function () {
                        UserStateService.removeContact(ctrl.overview.contacts, contactId);
                        ScrollRequest.removedElement(scrollRequestName);
                        ContactStatisticTypes.removeContact(ctrl.statistic);
                    });
                };

                ctrl.moveContact = function (contactId, name) {
                    UserStateService.moveContact(contactId, name, ctrl.statistic.type).then(function (newGroup) {
                        UserStateService.removeContact(ctrl.overview.contacts, contactId);
                        ScrollRequest.removedElement(scrollRequestName);
                        ContactStatisticTypes.moveContact(ctrl.statistic, newGroup);
                    });
                };
            }];
    }
};

