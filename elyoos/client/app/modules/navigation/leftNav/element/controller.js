'use strict';

var getHighlightedStyle = function ($state, baseState) {

    if ($state.includes(baseState)) {
        return {'color': '#3F51B5'};
    }
    return {};
};

module.exports = ['$state', '$rootScope', '$mdSidenav', function ($state, $rootScope, $mdSidenav) {

    var ctrl = this;

    ctrl.$state = $state;

    ctrl.goToState = function () {
        $mdSidenav("left").close();
        if (angular.isFunction(ctrl.onClick)) {
            ctrl.onClick();
        } else {
            $state.go(ctrl.state, {}, {reload: true});
        }
    };

    $rootScope.$on('$stateChangeSuccess', function () {
        ctrl.highlightedStyle = getHighlightedStyle($state, ctrl.baseState);
    });
}];
