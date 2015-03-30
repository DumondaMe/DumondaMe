'use strict';

var countryCodes = [{country: 'Schweiz', code: 'CH'},
    {country: 'Deutschland', code: 'DE'},
    {country: 'Österreich', code: 'AT'},
    {country: 'Frankreich', code: 'FR'},
    {country: 'Italien', code: 'IT'}];

function getCountryCode(country) {
    var result = false;
    angular.forEach(countryCodes, function (countryCode) {
        if (countryCode.country === country) {
            result = countryCode.code;
        }
    });
    return result;
}

module.exports = ['$scope', 'Register', 'moment',
    function ($scope, Register, moment) {

        var isDateValid = function (date) {
            return moment(date, 'l', moment.locale(), true).isValid();
        };

        $scope.userDataToChange = {};
        $scope.countryCodes = countryCodes;
        $scope.selectedCountryCode = '';
        $scope.submitFailed = false;
        $scope.submitFailedToServer = false;
        $scope.successUserDataChange = false;

        $scope.submitProfileData = function () {
            if (!$scope.profileForm.$invalid) {
                $scope.submitFailed = false;

                var submittedUser = {
                    email: $scope.userDataToChange.email,
                    password: $scope.userDataToChange.password,
                    forename: $scope.userDataToChange.forename,
                    surname: $scope.userDataToChange.surname,
                    birthday: moment.utc($scope.userDataToChange.birthday, 'l', moment.locale(), true).valueOf() / 1000,
                    country: getCountryCode($scope.selectedCountryCode),
                    female: $scope.userDataToChange.female
                };
                if (submittedUser.country) {
                    Register.save(submittedUser, function () {
                        $scope.profileForm.$setPristine();
                        $scope.successUserDataChange = true;
                        $scope.submitFailedToServer = false;
                    }, function () {
                        $scope.submitFailedToServer = true;
                        $scope.successUserDataChange = false;
                    });
                } else {
                    $scope.submitFailed = true;
                }
            } else {
                $scope.submitFailed = true;
            }
        };

        $scope.getDateExample = function () {
            var unixTimestamp = 385974036;
            return moment.unix(unixTimestamp).format('l');
        };

        $scope.$watch('userDataToChange.birthday', function (newBirthday) {
            if (newBirthday && $scope.profileForm && $scope.profileForm.inputBirthday) {
                $scope.profileForm.inputBirthday.$setValidity('date', isDateValid(newBirthday));
            }
        });
    }];
