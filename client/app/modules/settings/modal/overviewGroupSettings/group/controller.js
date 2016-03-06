'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['PrivacyPublicCheckService',
            function (PrivacyPublicCheckService) {
                var ctrl = this;

                ctrl.isPublic = PrivacyPublicCheckService.isPublic(ctrl.group);

                ctrl.callEditMode = function() {

                };
            }];
    }
};

