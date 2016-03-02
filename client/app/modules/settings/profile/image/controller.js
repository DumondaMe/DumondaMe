'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ElyModal', 'UploadProfileImageState',
            function (ElyModal, UploadProfileImageState) {
                var ctrl = this;

                ctrl.uploadProfileImage = function () {
                    ElyModal.show('UtilFileUploadCropImageCtrl', 'app/modules/util/file/uploadCropImage/template.html',
                        {ratio: 1, uploadUrl: '/api/user/settings/uploadProfileImage', }).then(function () {
                        UploadProfileImageState.profileImageChanged();
                    });
                };
            }];
    }
};

