'use strict';

var minScreenSize = 800;

var setContainerWidth = function($scope) {
    var containerSize, screenWidth = $(window).width();
    if(screenWidth > minScreenSize) {
        containerSize = screenWidth - 468;
        $scope.numberOfElements = Math.floor(containerSize / 350);
    } else {
        $scope.numberOfElements = 2;
    }

    $scope.containerWidth = containerSize;
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
