'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ScrollRequest', 'Contact', 'ContactOverviewResponseHandler', 'UserStateService', 'GroupSettingsService', 'ContactGroupStatistic',
            '$state',
            function (ScrollRequest, Contact, ContactOverviewResponseHandler, UserStateService, GroupSettingsService, ContactGroupStatistic, $state) {
                var ctrl = this;
                var scrollRequestName = 'ContactOverview' + ctrl.statistic.type;
                var requestedContacts = false;
                ctrl.overview = {contacts: []};
                ctrl.isExpanded = false;
                ctrl.hasNext = false;

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
                    var params = {types: [ctrl.statistic.group]};
                    ctrl.hasNext = false;
                    ScrollRequest.nextRequest(scrollRequestName, ctrl.overview.contacts, params).then(function (overview) {
                        ctrl.overview = overview;
                        ctrl.hasNext = ScrollRequest.hasNext(scrollRequestName);
                    });
                };

                ctrl.statistic.reloadContact = function () {
                    ctrl.overview = {contacts: []};
                    ScrollRequest.reset(scrollRequestName, Contact.get, ContactOverviewResponseHandler);
                    ctrl.nextOverview();
                };

                ctrl.changeGroupName = function () {
                    GroupSettingsService.renameGroupName(ctrl.statistic.group);
                };

                ctrl.deleteGroup = function () {
                    GroupSettingsService.deleteGroup(ctrl.statistic.group, ctrl.statistic.count);
                };

                ctrl.blockContact = function (contactId) {
                    UserStateService.blockContact(contactId).then(function () {
                        UserStateService.removeContact(ctrl.overview.contacts, contactId);
                        ScrollRequest.removedElement(scrollRequestName);
                        ContactGroupStatistic.removeContact(ctrl.statistic);
                        ctrl.removedContact();
                    });
                };

                ctrl.deleteContact = function (contactId) {
                    UserStateService.deleteContact(contactId).then(function () {
                        UserStateService.removeContact(ctrl.overview.contacts, contactId);
                        ScrollRequest.removedElement(scrollRequestName);
                        ContactGroupStatistic.removeContact(ctrl.statistic);
                        ctrl.removedContact();
                    });
                };

                ctrl.moveContact = function (contactId, name) {
                    UserStateService.moveContact(contactId, name, ctrl.statistic.group).then(function (newGroup) {
                        UserStateService.removeContact(ctrl.overview.contacts, contactId);
                        ScrollRequest.removedElement(scrollRequestName);
                        ContactGroupStatistic.moveContact(ctrl.statistic, newGroup);
                    });
                };

                ctrl.goToDetail = function (userId) {
                    $state.go('user.detail', {userId: userId});
                };
            }];
    }
};

