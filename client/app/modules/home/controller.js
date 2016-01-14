'use strict';

module.exports = {
    directiveCtrl: function () {
        return [ 'Home', '$mdDialog', 'ScrollRequest', 'HomePinwall','HomeScrollRequestResponseHandler',
            function (Home, $mdDialog, ScrollRequest, HomePinwall, HomeScrollRequestResponseHandler) {
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
                        HomePinwall.addBlog(ctrl.home.pinwall, resp);
                    });
                };

                ScrollRequest.reset('home', Home.get, HomeScrollRequestResponseHandler);

                ctrl.nextPinwallInfo = function () {
                    ScrollRequest.nextRequest('home', ctrl.home.pinwall).then(function (pinwall) {
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

