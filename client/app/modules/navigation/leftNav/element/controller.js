'use strict';

var getHighlightedStyle = function ($state, baseState) {

    if ($state.includes(baseState)) {
        return {'color': '#FF5252'};
    }
    return {};
};

module.exports = {
    directiveCtrl: function () {
        return ['$state', '$rootScope', function ($state, $rootScope) {

            var ctrl = this;

            ctrl.$state = $state;

            ctrl.goToState = function () {
                $state.go(ctrl.state);
            };

            $rootScope.$on('$stateChangeSuccess', function () {
                ctrl.highlightedStyle = getHighlightedStyle($state, ctrl.baseState);
            });
        }];
    }
};
