'use strict';

var minScreenSize = 1000;
var maxScreenSize = 1900;

var setContainerWidth = function($scope) {
    var containerSize, screenWidth = $(window).width();
    if(screenWidth > minScreenSize && screenWidth <= maxScreenSize) {
        containerSize = screenWidth - 270;
        $scope.numberOfElements = Math.floor(containerSize / 190);
    } else if(screenWidth < minScreenSize) {
        $scope.numberOfElements = 4;
    } else if(screenWidth > maxScreenSize) {
        $scope.numberOfElements = 8;
    }

    $scope.containerWidth = 190 * $scope.numberOfElements;
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
