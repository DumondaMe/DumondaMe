'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'Home', '$mdDialog', 'HomePinwallRequest', 'HomePinwall',
            function ($scope, Home, $mdDialog, HomePinwallRequest, HomePinwall) {
                var ctrl = this;
                ctrl.home = {};

                ctrl.createBlog = function () {
                    $mdDialog.show({
                        templateUrl: 'app/modules/home/createBlog/template.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        escapeToClose: false,
                        controller: 'HomePinwallCreateBlog',
                        locals: {element: ctrl.element},
                        bindToController: true,
                        controllerAs: 'ctrl'
                    }).then(function (resp) {
                        ctrl.home.pinwall.unshift(resp);
                    });
                };

                HomePinwallRequest.reset();

                ctrl.nextPinwallInfo = function () {
                    HomePinwallRequest.requestPinwall(ctrl.home.pinwall).then(function (pinwall) {
                        ctrl.home = pinwall;
                    });
                };

                ctrl.blogRemoved = function (blogId) {
                    HomePinwall.removeBlog(ctrl.home.pinwall, blogId);
                };

                ctrl.nextPinwallInfo();
            }];
    }
};

