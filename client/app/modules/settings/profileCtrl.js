'use strict';

module.exports = ['$scope', '$filter', 'HttpService', function ($scope, $filter, HttpService) {
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.userDataToChange = angular.copy($scope.user);
    $scope.submitFailed = false;
    $scope.submitFailedToServer = false;
    $scope.successUserDataChange = false;

    if ($scope.userDataToChange && $scope.userDataToChange.female === undefined) {
        $scope.userDataToChange.female = true;
    }

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
            HttpService.sendPostRequest(submittedUser, '/api/user/profile').then(function () {
                $scope.profileForm.$setPristine();
                $scope.successUserDataChange = true;
                $scope.submitFailedToServer = false;
                $scope.user.forename = $scope.userDataToChange.forename;
                $scope.user.surname = $scope.userDataToChange.surname;
                $scope.user.birthday = $scope.userDataToChange.birthday;
                $scope.user.street = $scope.userDataToChange.street;
                $scope.user.place = $scope.userDataToChange.place;
                $scope.user.country = $scope.userDataToChange.country;
                $scope.user.female = $scope.userDataToChange.female;
            }, function () {
                $scope.submitFailedToServer = true;
                $scope.successUserDataChange = false;
            });
        } else {
            $scope.submitFailed = true;
        }
    };
}];
