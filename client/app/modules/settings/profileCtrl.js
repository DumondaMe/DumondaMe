'use strict';

module.exports = ['$scope', '$filter', 'HttpService', function ($scope, $filter, HttpService) {
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.userDataToChange = {};
    $scope.submitFailed = false;
    $scope.submitFailedToServer = false;
    $scope.successUserDataChange = false;

    $scope.getUserData = function () {
        HttpService.sendGetRequest('api/user/settings/profile').then(function (data) {
            $scope.userDataToChange = data;
        }, function () {
            //TODO: Error Handling
        });
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
            HttpService.sendPostRequest(submittedUser, '/api/user/settings/profile').then(function () {
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
