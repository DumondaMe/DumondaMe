'use strict';

module.exports = ['Privacy', '$q', 'ElyModal', 'ContactStatisticTypes',
    function (Privacy, $q, ElyModal, ContactStatisticTypes) {

        this.addGroup = function () {
            return ElyModal.show('AddGroupController', 'app/modules/settings/modal/addGroup/template.html');
        };

        this.deleteGroup = function (groupName, numberOfContacts) {
            var types = ContactStatisticTypes.getTypes();
            if (types.length > 0) {
                if (numberOfContacts === 0) {
                    return Privacy.delete({
                        privacyDescription: groupName,
                        newPrivacyDescription: types[0]
                    }).$promise.then(function () {
                        ContactStatisticTypes.removeType(groupName);
                    });
                } else {
                    return ElyModal.show('DeleteGroupController', 'app/modules/settings/modal/deleteGroup/template.html', {groupName: groupName})
                        .then(function (newGroupName) {
                            ContactStatisticTypes.removeType(groupName, newGroupName);
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
                    ContactStatisticTypes.renameType(groupName, newGroupName);
                });
        };
    }]
;
