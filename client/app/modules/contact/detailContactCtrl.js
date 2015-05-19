'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'ContactDetail', 'moment', 'CountryCodeConverter',
    'ContactUserActions', 'ContactLeftNavElements',
    function ($scope, $state, $stateParams, ContactDetail, moment, CountryCodeConverter, ContactUserActions, ContactLeftNavElements) {

        var contactDetails, numberOfExpand = 0, skipContacts = 7, contactsToAdd = 28;
        $scope.$scope = $scope;
        angular.extend($scope, ContactUserActions);

        $scope.$emit(ContactLeftNavElements.event, ContactLeftNavElements.elements);

        $scope.userId = $stateParams.userId;
        contactDetails = ContactDetail.get({
            userId: $stateParams.userId,
            skipContacts: 0,
            contactsPerPage: 7,
            mode: 'detailOfUser'
        }, function () {

            $scope.contact = contactDetails.contact;
            $scope.contact.id = $stateParams.userId;
            $scope.statistic = contactDetails.statistic;
            $scope.privacySettings = contactDetails.privacySettings;
            $scope.numberOfContacts = contactDetails.numberOfContacts;
            $scope.numberOfSameContacts = contactDetails.numberOfSameContacts;
            $scope.contacts = contactDetails.contacts;
            if ($scope.contact.country) {
                $scope.contact.country = CountryCodeConverter.getCountry($scope.contact.country);
            }
            if ($scope.contact.birthday) {
                $scope.contact.birthday = 'Geb. ' + moment.unix($scope.contact.birthday).format('l');
            }
            ContactUserActions.setPrivacySettings($scope);
            ContactUserActions.setConnectionState($scope);
        });

        $scope.appendContacts = function () {
            var contactOfUser = ContactDetail.get({
                userId: $stateParams.userId,
                skipContacts: skipContacts,
                contactsPerPage: contactsToAdd,
                mode: 'onlyContacts'
            }, function () {
                if ($scope.contacts) {
                    numberOfExpand = numberOfExpand + 1;
                    $scope.contacts = $scope.contacts.concat(contactOfUser.contacts);
                    if (numberOfExpand === 1) {
                        skipContacts = 35;
                    } else {
                        skipContacts += contactsToAdd;
                    }
                }
            });
        };

        $scope.openUserDetails = function (userId) {
            $state.go('contact.detail', {
                userId: userId
            });
        };
    }];
