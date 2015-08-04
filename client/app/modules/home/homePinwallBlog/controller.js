'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {
            $scope.user = {blogText: '', uploadBlogIsRunning: false};
        }];
    }
};

