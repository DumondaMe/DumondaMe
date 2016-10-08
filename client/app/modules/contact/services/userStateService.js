'use strict';

module.exports = ['Contact', 'ContactStatisticTypes', '$q', '$mdDialog', 'errorToast',
    function (Contact, ContactStatisticTypes, $q, $mdDialog, errorToast) {

        this.addContact = function (contactId, name) {
            var types = ContactStatisticTypes.getTypes();
            if (angular.isString(contactId) && angular.isString(name)) {
                if (types.length !== 1) {
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
                return Contact.save({
                    contactIds: [contactId],
                    mode: 'addContact',
                    description: types[0]
                },function () {
                }, function () {
                    errorToast.showError('Es ist ein Fehler aufgetretten!');
                }).$promise;
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

        this.moveContact = function (contactId, name, previousType) {
            if (angular.isString(contactId) && angular.isString(name)) {

                return $mdDialog.show({
                    templateUrl: 'app/modules/contact/modal/moveContact/template.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    controller: 'MoveContactController',
                    locals: {name: name, contactId: contactId, previousType: previousType},
                    bindToController: true,
                    controllerAs: 'ctrl'
                });
            }
            return $q.reject();
        };
    }];
