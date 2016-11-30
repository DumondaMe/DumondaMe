'use strict';

module.exports = ['ElyModal', 'UploadProfileImageState', '$state', 'ImageViewService',
    function (ElyModal, UploadProfileImageState, $state, ImageViewService) {
        var ctrl = this;

        ctrl.uploadProfileImage = function () {
            ElyModal.show('UtilFileUploadCropImageCtrl', 'app/modules/util/file/uploadCropImage/template.html',
                {ratio: 1, uploadUrl: '/api/user/settings/uploadProfileImage'}).then(function () {
                UploadProfileImageState.profileImageChanged();
            });
        };

        ctrl.goToContacting = function () {
            $state.go('contact.overview', {showContacting: true});
        };

        ctrl.openImageView = function () {
            ImageViewService.showImage(ctrl.profile.profileImage);
        };
    }];

