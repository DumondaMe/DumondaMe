'use strict';

module.exports = ['$scope', 'Home', 'HomeLeftNavElements', function ($scope, Home, HomeLeftNavElements) {

    var skip = 0, itemsPerPage = 40;

    $scope.$emit(HomeLeftNavElements.event, HomeLeftNavElements.elements);

    $scope.pinwall = Home.get({maxItems: itemsPerPage, skip: skip});
}];
