'use strict';

module.exports = ['ElyModal', function (ElyModal) {
    var ctrl = this;

    ctrl.openPrivacyOverview = function () {
        ElyModal.show('OverviewGroupSettingController', 'app/modules/settings/modal/overviewGroupSettings/template.html');
    };
}];

