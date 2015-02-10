'use strict';

module.exports = ['$scope', '$filter', 'Profile', 'profileImage', 'moment',
    function ($scope, $filter, Profile, profileImage, moment) {

        var isDateValid = function (date) {
            return moment(date, 'l', moment.locale(), true).isValid();
        };

        $scope.userDataToChange = {};
        $scope.submitFailed = false;
        $scope.submitFailedToServer = false;
        $scope.successUserDataChange = false;

        $scope.getUserData = function () {
            $scope.userDataToChange = Profile.get({}, function () {
                $scope.userDataToChange.birthday = moment.unix($scope.userDataToChange.birthday).format('l');
            });
        };
        $scope.getUserData();

        profileImage.addProfileImageChangedEvent($scope, 'userDataToChange');

        $scope.submitProfileData = function () {
            if (!$scope.profileForm.$invalid) {
                $scope.submitFailed = false;

                var submittedUser = {
                    forename: $scope.userDataToChange.forename,
                    surname: $scope.userDataToChange.surname,
                    birthday: moment.utc($scope.userDataToChange.birthday, 'l', moment.locale(), true).valueOf() / 1000,
                    street: $scope.userDataToChange.street,
                    place: $scope.userDataToChange.place,
                    country: $scope.userDataToChange.country,
                    female: $scope.userDataToChange.female
                };
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
