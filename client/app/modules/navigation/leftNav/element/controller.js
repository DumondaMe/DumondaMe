'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$state', '$rootScope', function ($scope, $state) {

            var ctrl = this;

            $scope.goToState = function () {
                $state.go(ctrl.state);
            };
        }];
    }
};
