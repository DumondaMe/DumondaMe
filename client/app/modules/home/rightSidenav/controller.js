'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ElyModal', '$mdSidenav', 'PinwallBlogService',
            function (ElyModal, $mdSidenav, PinwallBlogService) {
                var ctrl = this;

                ctrl.createBlog = function () {
                    $mdSidenav('rightHomeNav').close();
                    ElyModal.show('HomePinwallCreateBlog', 'app/modules/home/createBlog/template.html', {element: ctrl.element})
                        .then(function (resp) {
                            PinwallBlogService.addBlog(ctrl.pinwall, resp);
                        });
                };

                ctrl.createBookPage = function () {
                    $mdSidenav('rightHomeNav').close();
                    ElyModal.show('CreateBookPageCtrl', 'app/modules/page/modal/createBookPage/template.html');
                };
            }];
    }
};

