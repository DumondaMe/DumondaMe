'use strict';

module.exports = ['Privacy', '$q', 'ElyModal', 'ContactGroupStatistic',
    function (Privacy, $q, ElyModal, ContactGroupStatistic) {

        this.addGroup = function () {
            return ElyModal.show('AddGroupController', 'app/modules/settings/modal/addGroup/template.html');
        };

        this.deleteGroup = function (groupName, numberOfContacts) {
            var contactGroups = ContactGroupStatistic.getGroups();
            if (contactGroups.length > 0) {
                if (numberOfContacts === 0) {
                    return Privacy.delete({
                        privacyDescription: groupName,
                        newPrivacyDescription: contactGroups[0]
                    }).$promise.then(function () {
                        ContactGroupStatistic.removeGroup(groupName);
                    });
                } else {
                    return ElyModal.show('DeleteGroupController', 'app/modules/settings/modal/deleteGroup/template.html', {groupName: groupName})
                        .then(function (newGroupName) {
                            ContactGroupStatistic.removeGroup(groupName, newGroupName);
                        });
                }
            } else {
                return $q.reject();
            }
        };

        this.renameGroupName = function (groupName) {
            ElyModal.show('RenameGroupNameController', 'app/modules/settings/modal/renameGroupName/template.html', {
                    groupName: groupName
                })
                .then(function (newGroupName) {
                    ContactGroupStatistic.renameGroup(groupName, newGroupName);
                });
        };
    }]
;
