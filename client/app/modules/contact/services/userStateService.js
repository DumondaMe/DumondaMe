'use strict';

module.exports = ['Contact', '$q', '$mdDialog',
    function (Contact, $q, $mdDialog) {

        this.addContact = function (contactId, name) {
            if (angular.isString(contactId)) {

                return $mdDialog.show({
                    templateUrl: 'app/modules/contact/modal/addContact/template.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    controller: 'AddContactController',
                    locals: {name: name, contactId: contactId},
                    bindToController: true,
                    controllerAs: 'ctrl'
                });
            }
            return $q.reject();
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
    }];
