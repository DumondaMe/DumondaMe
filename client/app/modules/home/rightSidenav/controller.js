'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$mdDialog', '$mdSidenav', 'PinwallBlogService',
            function ($mdDialog, $mdSidenav, PinwallBlogService) {
                var ctrl = this;

                ctrl.createBlog = function () {
                    $mdSidenav('rightHomeNav').close();
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
                        PinwallBlogService.addBlog(ctrl.pinwall, resp);
                    });
                };
            }];
    }
};

