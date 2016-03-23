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
                    ElyModal.show('ManageBookPageCtrl', 'app/modules/page/modal/manageBookPage/template.html');
                };

                ctrl.createYoutubePage = function () {
                    $mdSidenav('rightHomeNav').close();
                    ElyModal.show('ManageYoutubePageCtrl', 'app/modules/page/modal/manageYoutubePage/template.html');
                };
            }];
    }
};

