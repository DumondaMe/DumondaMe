'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ElyModal',
            function (ElyModal) {
                var ctrl = this;

                ctrl.colapsed = true;

                ctrl.openChangePassword = function () {
                    ElyModal.show('SettingChangePasswordCtrl', 'app/modules/settings/modal/changePassword/template.html');
                };

                ctrl.openChangeProfileData = function () {
                    ElyModal.show('SettingChangeProfileDataCtrl', 'app/modules/settings/modal/changeProfileData/template.html');
                };

                ctrl.openPrivacyOverview = function () {
                    ElyModal.show('OverviewGroupSettingController', 'app/modules/settings/modal/overviewGroupSettings/template.html');
                };
            }];
    }
};

