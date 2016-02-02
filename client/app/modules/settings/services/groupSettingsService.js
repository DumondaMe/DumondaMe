'use strict';

module.exports = ['Privacy', '$q', '$mdDialog',
    function (Privacy, $q, $mdDialog) {

        this.addGroup = function () {

            return $mdDialog.show({
                templateUrl: 'app/modules/settings/modal/addGroup/template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                controller: 'AddGroupController',
                //locals: {name: name},
                bindToController: true,
                controllerAs: 'ctrl'
            });
        };

        this.deleteContact = function (contactId) {
            if (angular.isString(contactId)) {
                return Contact.delete({
                    contactIds: [contactId]
                }).$promise;
            }
            return $q.reject();
        };

        this.blockContact = function (contactId) {
            if (angular.isString(contactId)) {
                return Contact.save({
                    mode: 'blockContact',
                    contactIds: [contactId]
                }).$promise;
            }
            return $q.reject();
        };

        this.unblockContact = function (contactId) {
            if (angular.isString(contactId)) {
                return Contact.save({
                    mode: 'unblockContact',
                    contactIds: [contactId]
                }).$promise;
            }
            return $q.reject();
        };

        this.removeContact = function (overviewCollection, contactId) {
            var elementToRemove;
            angular.forEach(overviewCollection, function (contactPreview) {
                if (contactPreview.userId === contactId) {
                    elementToRemove = contactPreview;
                }
            });
            if (elementToRemove) {
                overviewCollection.splice(overviewCollection.indexOf(elementToRemove), 1);
            }
        };
    }]
;
