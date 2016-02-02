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
                    //Modal
                }
            } else {
                return $q.reject();
            }
        };
    }]
;
