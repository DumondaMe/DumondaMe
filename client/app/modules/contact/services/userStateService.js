'use strict';

module.exports = ['Contact', '$q', '$mdDialog',
    function (Contact, $q, $mdDialog) {

        this.addContact = function (contactId, name) {
            if (angular.isString(contactId)) {

                var selectedPrivacyType;
                return $mdDialog.show({
                    templateUrl: 'app/modules/contact/services/modal/selectGroup/template.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    controller: 'SelectContactGroupController',
                    locals: {name: name},
                    bindToController: true,
                    controllerAs: 'ctrl'
                }).then(function (privacyType) {
                    selectedPrivacyType = privacyType;
                    return Contact.save({
                        contactIds: [contactId],
                        mode: 'addContact',
                        description: privacyType
                    }).$promise.then(function () {
                        return selectedPrivacyType;
                    });
                });
            } else {
                return $q.reject();
            }
        };

        this.deleteContact = function (contactId) {
            if (angular.isString(contactId)) {
                return Contact.delete({
                    contactIds: [contactId]
                }).$promise;
            } else {
                return $q.reject();
            }
        };

        this.blockContact = function ($scope) {
            var contact = Contact.save({
                mode: 'blockContact',
                contactIds: [$scope.contact.userId]
            }, function () {

            });
        };

        this.unblockContact = function ($scope) {
            var contact = Contact.save({
                mode: 'unblockContact',
                contactIds: [$scope.contact.userId]
            }, function () {

            });
        };
    }];
