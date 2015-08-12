'use strict';

var initialized = false;

module.exports = ['$state', '$timeout', '$window',
    function ($state, $timeout, $window) {
        this.addRootScopeEvents = function ($rootScope) {

            if (!initialized) {
                initialized = true;
                // Navigation from home to recommendation or blog and back to home shall use the cache
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                    if (fromState.name === "home" && (toState.name === "page.detail")) {
                        toState.previousIsHome = true;
                        toState.previousYPos = $window.scrollY;
                    } else if (toState.name === "home") {
                        if (fromState.previousIsHome) {
                            delete fromState.previousIsHome;
                            event.preventDefault();
                            $state.go(toState.name, {
                                cache: "cache"
                            });
                            $timeout(function () {
                                $window.scrollTo(0, fromState.previousYPos);
                            }, 0, false);
                        }
                    } else {
                        delete fromState.previousIsHome;
                    }
                });

                $rootScope.$watch('fullScreen.show', function (newShow) {
                    if (newShow === false && $rootScope.fullScreen && $rootScope.fullScreen.scrollY > 0) {
                        $timeout(function () {
                            $window.scrollTo(0, $rootScope.fullScreen.scrollY);
                        }, 100, false);
                    }
                });
            }
        };
    }];
