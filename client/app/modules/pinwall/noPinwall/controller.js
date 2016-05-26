'use strict';

module.exports = ['ElyModal', 'PinwallBlogService', function (ElyModal, PinwallBlogService) {
    var ctrl = this;

    ctrl.createBlog = function () {
        ElyModal.show('HomePinwallCreateBlog', 'app/modules/home/createBlog/template.html', {})
            .then(function (resp) {
                PinwallBlogService.addBlog(ctrl.home.pinwall, resp);
            });
    };
}];

