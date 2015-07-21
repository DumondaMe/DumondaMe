'use strict';

var navigationWidth = 240;

var setContainerWidth = function($scope) {
    var containerWidth, screenWidth = $(window).width();
    containerWidth = screenWidth - navigationWidth;
    $scope.numberOfRows = 1;
    if(containerWidth <= 950) {
        $scope.containerWidth = 450;
    } else if(containerWidth > 950 && containerWidth <= 1400) {
        $scope.containerWidth = 900;
        $scope.numberOfRows = 2;
    } else if(screenWidth > 1400) {
        $scope.containerWidth = 1350;
        $scope.numberOfRows = 3;
    }

    $scope.$applyAsync();
};

module.exports = {
    directiveLink: function () {
        return function ($scope) {
            $(window).resize(function () {
                setContainerWidth($scope);
            });

            setContainerWidth($scope);
        };
    }
};
