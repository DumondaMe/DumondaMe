'use strict';

module.exports = ['$scope', '$stateParams', 'ContactDetail', 'moment', 'CountryCodeConverter', 'ContactUserActions',
    function ($scope, $stateParams, ContactDetail, moment, CountryCodeConverter, ContactUserActions) {

        $scope.userId = $stateParams.userId;
        $scope.contactDetails = ContactDetail.get({userId: $stateParams.userId}, function () {
            if ($scope.contactDetails.details.country) {
                $scope.contactDetails.details.country = CountryCodeConverter.getCountry($scope.contactDetails.details.country);
            }
            if ($scope.contactDetails.details.birthday) {
                $scope.contactDetails.details.birthday = 'Geb. ' + moment.unix($scope.contactDetails.details.birthday).format('l');
            }
        });

        $scope.sendMessage = ContactUserActions.sendMessage;
    }];
