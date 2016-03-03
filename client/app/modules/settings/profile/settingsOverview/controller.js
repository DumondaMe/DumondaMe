'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ElyModal',
            function (ElyModal) {
                var ctrl = this;

                ctrl.colapsed = true;

                ctrl.openChangePassword = function () {
                    ElyModal.show('SettingChangePasswordCtrl', 'app/modules/settings/modal/changePassword/template.html')
                };
            }];
    }
};

