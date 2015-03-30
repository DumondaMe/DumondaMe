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

function getCountry(code) {
    var result = countryCodes[0].country;
    angular.forEach(countryCodes, function (countryCode) {
        if (countryCode.code === code) {
            result = countryCode.country;
        }
    });
    return result;
}

module.exports = ['$scope', 'Profile', 'profileImage', 'moment',
    function ($scope, Profile, profileImage, moment) {

        var isDateValid = function (date) {
            return moment(date, 'l', moment.locale(), true).isValid();
        };

        $scope.countryCodes = countryCodes;
        $scope.selectedCountryCode = '';
        $scope.userDataToChange = {};
        $scope.submitFailed = false;
        $scope.submitFailedToServer = false;
        $scope.successUserDataChange = false;

        $scope.getUserData = function () {
            $scope.userDataToChange = Profile.get({}, function () {
                $scope.userDataToChange.birthday = moment.unix($scope.userDataToChange.birthday).format('l');
                $scope.selectedCountryCode = getCountry($scope.userDataToChange.country);
            });
        };
        $scope.getUserData();

        profileImage.addProfileImageChangedEvent($scope, function () {
            var profileData = Profile.get({}, function () {
                $scope.userDataToChange.profileImage = profileData.profileImage;
            });
        });

        $scope.submitProfileData = function () {
            $scope.submitFailed = false;

            if (!$scope.profileForm.$invalid) {
                var submittedUser = {
                    forename: $scope.userDataToChange.forename,
                    surname: $scope.userDataToChange.surname,
                    birthday: moment.utc($scope.userDataToChange.birthday, 'l', moment.locale(), true).valueOf() / 1000,
                    street: $scope.userDataToChange.street,
                    place: $scope.userDataToChange.place,
                    country: getCountryCode($scope.selectedCountryCode),
                    female: $scope.userDataToChange.female
                };
                if (submittedUser.country) {
                    Profile.save(submittedUser, function () {
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
