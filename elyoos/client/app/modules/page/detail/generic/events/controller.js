'use strict';

module.exports = ['ElyModal',
    function (ElyModal) {
        var ctrl = this;

        ctrl.commandsOverviewContainer = {};

        ctrl.createEvent = function () {
            ElyModal.show('ManageEventCtrl', 'app/modules/page/modal/manageEvent/template.html', {
                genericPageId: ctrl.pageId, addresses: ctrl.addresses
            }).then(function (resp) {
                ctrl.commandsOverviewContainer.addEvent(resp);
            });
        };
    }];

