'use strict';

var categories = {
    BookPage: 'Buch',
    VideoPage: 'Video',
    CoursePage: 'Kurs',
    SchoolPage: 'Schule'
};

module.exports = ['$scope', '$window', '$state', '$stateParams', 'PageDetail', function ($scope, $window, $state, $stateParams, PageDetail) {

    $scope.pageDetail = PageDetail.get({pageId: $stateParams.pageId, label: $stateParams.label}, function () {
        var collection;
        $scope.contributorsWithProfile = [];
        $scope.contributors = [];
        if ($stateParams.label === 'BookPage') {
            collection = $scope.pageDetail.page.author;
            $scope.contributorPrefix = 'von';
        } else if ($stateParams.label === 'VideoPage') {
            collection = $scope.pageDetail.page.actor;
            $scope.contributorPrefix = 'mit';
        } else if ($stateParams.label === 'SchoolPage') {
            collection = $scope.pageDetail.page.principal;
            $scope.contributorPrefix = 'wird geleited von';
        } else if ($stateParams.label === 'CoursePage') {
            collection = $scope.pageDetail.page.instructor;
            $scope.contributorPrefix = 'wird geleited von';
        }
        angular.forEach(collection, function (author) {
            if (author.userId) {
                $scope.contributorsWithProfile.push(author);
            } else {
                $scope.contributors.push(author);
            }
        });
    });

    $scope.category = categories[$stateParams.label];

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

    $scope.openLink = function (link) {
        if (link) {
            $window.open(link, '_blank');
        }
    };
}];
