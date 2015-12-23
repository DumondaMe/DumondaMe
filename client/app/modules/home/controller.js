'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'Home', '$mdDialog', 'HomePinwallRequest', function ($scope, Home, $mdDialog, HomePinwallRequest) {
            var ctrl = this;
            ctrl.home = {};

            ctrl.createBlog = function () {
                $mdDialog.show({
                    templateUrl: 'app/modules/home/createBlog/createBlog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    controller: 'HomePinwallCreateBlog',
                    locals: {element: ctrl.element},
                    bindToController: true,
                    controllerAs: 'ctrl'
                });
            };

            ctrl.nextPinwallInfo = function () {
                HomePinwallRequest.requestPinwall(ctrl.home.pinwall).then(function (pinwall) {
                    ctrl.home = pinwall;
                });
            };

            ctrl.nextPinwallInfo();
        }];
    }
};

