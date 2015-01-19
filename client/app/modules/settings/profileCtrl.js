'use strict';

module.exports = ['$scope', '$filter', 'Profile', function ($scope, $filter, Profile) {

    $scope.userDataToChange = {};
    $scope.submitFailed = false;
    $scope.submitFailedToServer = false;
    $scope.successUserDataChange = false;

    $scope.getUserData = function () {
        $scope.userDataToChange = Profile.get();
    };
    $scope.getUserData();

    $scope.submitProfileData = function () {
        if (!$scope.profileForm.$invalid) {
            $scope.submitFailed = false;

            var submittedUser = {
                forename: $scope.userDataToChange.forename,
                surname: $scope.userDataToChange.surname,
                birthday: $filter('date')($scope.userDataToChange.birthday, 'yyyy-MM-dd'),
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
}];
