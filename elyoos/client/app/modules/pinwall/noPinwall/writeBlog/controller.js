'use strict';

module.exports = ['ElyModal', 'PinwallHomeScrollService', function (ElyModal, PinwallHomeScrollService) {
    var ctrl = this;

    ctrl.createBlog = function () {
        ElyModal.show('HomePinwallCreateBlog', 'app/modules/home/createBlog/template.html', {})
            .then(function (resp) {
                PinwallHomeScrollService.addBlog(resp);
            });
    };
}];

