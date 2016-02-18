'use strict';

module.exports = ['Privacy', '$q', '$mdDialog', 'ContactStatisticTypes',
    function (Privacy, $q, $mdDialog, ContactStatisticTypes) {

        this.addGroup = function () {

            return $mdDialog.show({
                templateUrl: 'app/modules/settings/modal/addGroup/template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                controller: 'AddGroupController',
                bindToController: true,
                controllerAs: 'ctrl'
            });
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
                    return $mdDialog.show({
                        templateUrl: 'app/modules/settings/modal/deleteGroup/template.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        escapeToClose: false,
                        controller: 'DeleteGroupController',
                        locals: {groupName: groupName},
                        bindToController: true,
                        controllerAs: 'ctrl'
                    }).then(function (newGroupName) {
                        ContactStatisticTypes.removeType(groupName, newGroupName);
                    });
                }
            } else {
                return $q.reject();
            }
        };

        this.modifyGroupSetting = function (groupName) {
            return $mdDialog.show({
                templateUrl: 'app/modules/settings/modal/modifyGroupSettings/template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                controller: 'ModifyGroupSettingController',
                locals: {groupName: groupName},
                bindToController: true,
                controllerAs: 'ctrl'
            });
        }
    }]
;
