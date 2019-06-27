'use strict';

module.exports = ['ScrollRequest', 'Contact', 'ContactOverviewResponseHandler', 'UserStateService', 'GroupSettingsService',
    'ContactGroupStatistic', '$state', 'errorToast',
    function (ScrollRequest, Contact, ContactOverviewResponseHandler, UserStateService, GroupSettingsService,
              ContactGroupStatistic, $state, errorToast) {
        var ctrl = this;
        var scrollRequestName = (ctrl.scrollRequestName || 'ContactOverview') + ctrl.statistic.group;
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
        if (ctrl.showOnlyContact) {
            ctrl.nextOverview();
        }

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
            });
        };

        ctrl.deleteContact = function (contactId) {
            UserStateService.deleteContact(contactId).then(function () {
                UserStateService.removeContact(ctrl.overview.contacts, contactId);
                ScrollRequest.removedElement(scrollRequestName);
                ContactGroupStatistic.removeContact(ctrl.statistic);
            });
        };

        ctrl.moveContact = function (contactId, name) {
            UserStateService.moveContact(contactId, name, ctrl.statistic.group).then(function (newGroup) {
                UserStateService.removeContact(ctrl.overview.contacts, contactId);
                ScrollRequest.removedElement(scrollRequestName);
                ContactGroupStatistic.moveContact(ctrl.statistic, newGroup);
            });
        };

        ctrl.moveContactToActive = function (contactId, newGroup) {
            Contact.save({
                contactIds: [contactId],
                mode: 'changeState',
                description: newGroup
            }, function () {
                UserStateService.removeContact(ctrl.overview.contacts, contactId);
                ScrollRequest.removedElement(scrollRequestName);
                ContactGroupStatistic.moveContact(ctrl.statistic, newGroup);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
            });
        };

        ctrl.goToDetail = function (userId) {
            $state.go('user.detail', {userId: userId});
        };
    }];

