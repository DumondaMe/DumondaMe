'use strict';

module.exports = ['ElyModal', 'AddRemovePinwallElementService', function (ElyModal, AddRemovePinwallElementService) {
    var ctrl = this;

    ctrl.createBlog = function () {
        ElyModal.show('HomePinwallCreateBlog', 'app/modules/home/createBlog/template.html', {})
            .then(function (resp) {
                AddRemovePinwallElementService.addBlog(resp);
            });
    };
}];

