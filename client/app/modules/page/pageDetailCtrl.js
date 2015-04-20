'use strict';

var categories = {
    BookPage: 'Buch'
};

module.exports = ['$scope', '$state', '$stateParams', 'PageDetail', function ($scope, $state, $stateParams, PageDetail) {

    $scope.pageDetail = PageDetail.get({pageId: $stateParams.pageId, label: $stateParams.label}, function () {
        $scope.authorsWithProfile = [];
        $scope.authors = [];
        angular.forEach($scope.pageDetail.page.author, function (author) {
            if (author.userId) {
                $scope.authorsWithProfile.push(author);
            } else {
                $scope.authors.push(author);
            }
        });
    });

    $scope.category = categories[$stateParams.label];

    $scope.openUserDetail = function (userId) {
        if (userId) {
            $state.go('contact.detail', {
                userId: userId
            });
        }
    };
}];
