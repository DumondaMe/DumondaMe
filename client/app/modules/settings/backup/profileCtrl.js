'use strict';

module.exports = ['$scope', 'Profile', 'profileImage', 'moment', 'CountryCodeConverter', 'SettingLeftNavElements',
    function ($scope, Profile, profileImage, moment, CountryCodeConverter, SettingLeftNavElements) {

        var isDateValid = function (date) {
            return moment(date, 'l', moment.locale(), true).isValid();
        };

        $scope.countryCodes = CountryCodeConverter.countryCodes;
        $scope.selectedCountryCode = '';
        $scope.userDataToChange = {};
        $scope.submitFailed = false;
        $scope.submitFailedToServer = false;
        $scope.successUserDataChange = false;

        $scope.$emit(SettingLeftNavElements.event, SettingLeftNavElements.elements);

        $scope.getUserData = function () {
            $scope.userDataToChange = Profile.get({}, function () {
                $scope.userDataToChange.birthday = moment.unix($scope.userDataToChange.birthday).format('l');
                $scope.selectedCountryCode = CountryCodeConverter.getCountry($scope.userDataToChange.country);
                $scope.userDataToChange.isInit = true;
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
                        $scope.$broadcast('ely.send.button.success');
                    }, function () {
                        $scope.$broadcast('ely.send.button.error', 'Fehler auf dem Server. Die Werte konnten nicht gespeichert werden');
                        $scope.submitFailedToServer = true;
                        $scope.successUserDataChange = false;
                    });
                } else {
                    $scope.submitFailed = true;
                    $scope.$broadcast('ely.send.button.error', 'Bitte ein Land ausw\u00e4hlen');
                }
            } else {
                $scope.$broadcast('ely.send.button.error', 'Bitte f\u00fclle alle Felder korrekt aus');
                $scope.submitFailed = true;
            }
        };

        $scope.getDateExample = function () {
            var unixTimestamp = 385974036;
            return moment.unix(unixTimestamp).format('l');
        };

        $scope.$watch('selectedCountryCode', function (newCountryCode) {
            if (newCountryCode) {
                $scope.userDataToChange.country = CountryCodeConverter.getCountryCode(newCountryCode);
            }
        });

        $scope.$watch('userDataToChange.birthday', function (newBirthday) {
            if (newBirthday && $scope.profileForm && $scope.profileForm.inputBirthday) {
                $scope.profileForm.inputBirthday.$setValidity('custom', isDateValid(newBirthday));
            }
        });
    }];
