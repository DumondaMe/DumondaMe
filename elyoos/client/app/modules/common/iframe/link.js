'use strict';


module.exports = {
    directiveLink: function ($sce) {
        return function ($scope) {
            $scope.$watch('src', function (newSrc) {
                if (newSrc && $scope.secureLink && angular.isString(newSrc) && newSrc.search($scope.secureLink) !== -1) {
                    $scope.link = $sce.trustAsResourceUrl($scope.secureLink + newSrc.replace($scope.secureLink, ''));
                } else {
                    $scope.link = '';
                }
            });
        };
    }
};
