'use strict';

var getHighlightedStyle = function ($state, baseState) {

    if ($state.includes(baseState)) {
        return {'color': '#3F51B5'};
    }
    return {};
};

module.exports = {
    directiveCtrl: function () {
        return ['$state', '$rootScope', '$mdSidenav', function ($state, $rootScope, $mdSidenav) {

            var ctrl = this;

            ctrl.$state = $state;

            ctrl.goToState = function () {
                $mdSidenav("left").close();
                $state.go(ctrl.state);
            };

            $rootScope.$on('$stateChangeSuccess', function () {
                ctrl.highlightedStyle = getHighlightedStyle($state, ctrl.baseState);
            });
        }];
    }
};
