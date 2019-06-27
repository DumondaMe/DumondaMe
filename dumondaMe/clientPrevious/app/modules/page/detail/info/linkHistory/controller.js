'use strict';

module.exports = ['ElyModal', 'dateFormatter',
    function (ElyModal, dateFormatter) {
        var ctrl = this;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.getTime = dateFormatter.getTime;

        ctrl.selectLink = function (index) {
            ctrl.actualIndex = index;
            ctrl.selectedLinkEmbed = ctrl.linkHistory[index];
        };
        ctrl.selectLink(0);
    }];

