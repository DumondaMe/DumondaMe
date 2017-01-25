'use strict';

module.exports = ['ElyModal',
    function (ElyModal) {
        var ctrl = this;

        ctrl.createEvent = function () {
            ElyModal.show('ManageEventCtrl', 'app/modules/page/modal/manageEvent/template.html', {})
                .then(function (resp) {
                    //$state.go('page.detail', {label: 'Blog', pageId: resp.pageId});
                });
        };
    }];

