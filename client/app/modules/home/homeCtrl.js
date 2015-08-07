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

module.exports = ['$scope', '$rootScope', '$state', '$stateParams', 'HomeLeftNavElements', 'HomePinwallContainer',
    function ($scope, $rootScope, $state, $stateParams, HomeLeftNavElements, HomePinwallContainer) {

        $scope.$emit(HomeLeftNavElements.event, HomeLeftNavElements.elements);

        $scope.isExpanded = false;
        HomePinwallContainer.setScopeController($scope);
        if ($stateParams.cache !== 'cache') {
            HomePinwallContainer.resetCache();
            HomePinwallContainer.requestPinwall();
        }

        $scope.$watch('numberOfRows', function (newNumberOfRows) {
            if (newNumberOfRows) {
                HomePinwallContainer.updatePinwall($scope);
            }
        });

        $scope.nextPinwallInfo = function () {
            HomePinwallContainer.requestPinwall();
        };

        $scope.$on('message.changed', function (event, newMessages) {
            HomePinwallContainer.messageChanged(newMessages);
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

        $scope.elementRemoved = HomePinwallContainer.elementRemoved;
        $scope.blogAdded = HomePinwallContainer.blogAdded;

        $(window).resize(function () {
            setContainerWidth($scope);
        });

        setContainerWidth($scope);
    }];
