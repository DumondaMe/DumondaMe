'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['Home', '$mdDialog', 'ScrollRequest', 'PinwallBlogService', 'PinwallScrollRequestResponseHandler',
            function (Home, $mdDialog, ScrollRequest, PinwallBlogService, PinwallScrollRequestResponseHandler) {
                var ctrl = this;
                ctrl.home = {pinwall: []};
                ctrl.noPinwall = false;

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
                        PinwallBlogService.addBlog(ctrl.home.pinwall, resp);
                    });
                };

                ScrollRequest.reset('home', Home.get, PinwallScrollRequestResponseHandler);

                ctrl.nextPinwallInfo = function () {
                    ScrollRequest.nextRequest('home', ctrl.home.pinwall).then(function (pinwall) {
                        ctrl.home = pinwall;
                        if (pinwall.pinwall.length === 0) {
                            ctrl.noPinwall = true;
                        }
                    });
                };

                ctrl.nextPinwallInfo();
            }];
    }
};

