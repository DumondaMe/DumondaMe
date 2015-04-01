'use strict';

module.exports = ['$scope', 'Profile', 'profileImage', 'moment', 'CountryCodeConverter',
    function ($scope, Profile, profileImage, moment, CountryCodeConverter) {

        var isDateValid = function (date) {
            return moment(date, 'l', moment.locale(), true).isValid();
        };

        $scope.countryCodes = CountryCodeConverter.countryCodes;
        $scope.selectedCountryCode = '';
        $scope.userDataToChange = {};
        $scope.submitFailed = false;
        $scope.submitFailedToServer = false;
        $scope.successUserDataChange = false;

        $scope.getUserData = function () {
            $scope.userDataToChange = Profile.get({}, function () {
                $scope.userDataToChange.birthday = moment.unix($scope.userDataToChange.birthday).format('l');
                $scope.selectedCountryCode = CountryCodeConverter.getCountry($scope.userDataToChange.country);
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
                    country: CountryCodeConverter.getCountryCode($scope.selectedCountryCode),
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
