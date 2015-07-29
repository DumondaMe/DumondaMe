'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'FileReader', function ($scope, FileReader) {
            $scope.user = {blogText: ''};
        }];
    }
};

