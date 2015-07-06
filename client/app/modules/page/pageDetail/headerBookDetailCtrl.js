'use strict';

module.exports = ['$scope', '$window', '$state',
    function ($scope, $window, $state) {

        $scope.contributorPrefix = 'von';
        $scope.contributorsWithProfile = [];
        $scope.contributors = [];

        $scope.openUserDetail = function (userId, isLoggedInUser) {
            if (userId) {
                if (isLoggedInUser) {
                    $state.go('settings.profile', {
                        userId: userId
                    });
                } else {
                    $state.go('contact.detail', {
                        userId: userId
                    });
                }
            }
        };

        $scope.$watch('pageDetail.page', function (newPageDetail) {
            if (newPageDetail) {
                $scope.contributorsWithProfile = [];
                $scope.contributors = [];
                angular.forEach(newPageDetail.author, function (author) {
                    if (author.userId) {
                        $scope.contributorsWithProfile.push(author);
                    } else {
                        $scope.contributors.push(author);
                    }
                });
            }
        });
    }];
