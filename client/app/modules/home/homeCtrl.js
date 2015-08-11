'use strict';

var navigationWidth = 240;

var setContainerWidth = function ($scope) {
    var containerWidth, screenWidth = $(window).width();
    containerWidth = screenWidth - navigationWidth;
    $scope.numberOfRows = 1;
    if (containerWidth <= 950) {
        $scope.containerWidth = 450;
    } else if (containerWidth > 950 && containerWidth <= 1400) {
        $scope.containerWidth = 900;
        $scope.numberOfRows = 2;
    } else if (screenWidth > 1400) {
        $scope.containerWidth = 1350;
        $scope.numberOfRows = 3;
    }

    $scope.$applyAsync();
};

var updatePinwall = function ($scope, HomePinwall) {
    var pinwall = HomePinwall.updatePinwall();
    $scope.pinwall1Elements = pinwall.pinwall1Elements;
    $scope.pinwall2Elements = pinwall.pinwall2Elements;
    $scope.pinwall3Elements = pinwall.pinwall3Elements;
    $scope.userInfo = pinwall.userInfo;
};

module.exports = ['$scope', '$rootScope', '$state', '$stateParams', 'HomeLeftNavElements', 'HomePinwallRequest', 'HomePinwall',
    function ($scope, $rootScope, $state, $stateParams, HomeLeftNavElements, HomePinwallRequest, HomePinwall) {

        $scope.$emit(HomeLeftNavElements.event, HomeLeftNavElements.elements);

        $scope.isExpanded = false;
        if ($stateParams.cache !== 'cache') {
            HomePinwallRequest.resetCache();
            HomePinwallRequest.requestPinwall().then(function () {
                updatePinwall($scope, HomePinwall);
            });
        }

        $scope.$watch('numberOfRows', function (newNumberOfRows) {
            if (newNumberOfRows) {
                HomePinwall.setNumberOfRows(newNumberOfRows);
                updatePinwall($scope, HomePinwall);
            }
        });

        $scope.nextPinwallInfo = function () {
            HomePinwallRequest.requestPinwall().then(function () {
                updatePinwall($scope, HomePinwall);
            });
        };

        $scope.$on('message.changed', function (event, newMessages) {
            HomePinwall.messageChanged(newMessages);
        });

        // Navigation from home to recommendation or blog and back to home shall use the cache
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
            if (fromState.name === "home" && (toState.name === "page.detail")) {
                toState.previousIsHome = true;
            } else if (toState.name === "home") {
                if (fromState.previousIsHome) {
                    delete fromState.previousIsHome;
                    event.preventDefault();
                    $state.go(toState.name, {
                        cache: "cache"
                    });
                }
            } else {
                delete fromState.previousIsHome;
            }
        });

        $scope.elementRemoved = function (element) {
            HomePinwall.elementRemoved(element);
            updatePinwall($scope, HomePinwall);
        };

        $scope.blogAdded = function (blog) {
            HomePinwall.blogAdded(blog);
            updatePinwall($scope, HomePinwall);
        };

        $(window).resize(function () {
            setContainerWidth($scope);
        });

        setContainerWidth($scope);
    }];
