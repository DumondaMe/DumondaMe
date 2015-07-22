'use strict';

module.exports = ['$scope', 'Home', 'HomeLeftNavElements', function ($scope, Home, HomeLeftNavElements) {

    $scope.$emit(HomeLeftNavElements.event, HomeLeftNavElements.elements);
}];
