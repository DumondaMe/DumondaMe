'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'ContactDetail', 'moment', 'CountryCodeConverter', 'ContactUserActions',
    function ($scope, $state, $stateParams, ContactDetail, moment, CountryCodeConverter, ContactUserActions) {

        var contactDetails;
        $scope.$scope = $scope;
        angular.extend($scope, ContactUserActions);

        $scope.userId = $stateParams.userId;
        contactDetails = ContactDetail.get({userId: $stateParams.userId}, function () {

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

        $scope.openUserDetails = function (userId) {
            $state.go('contact.detail', {
                userId: userId
            });
        };
    }];
