'use strict';

module.exports = ['ElyModal', 'UploadProfileImageState',
    function (ElyModal, UploadProfileImageState) {
        var ctrl = this;

        ctrl.uploadProfileImage = function () {
            ElyModal.show('UtilFileUploadCropImageCtrl', 'app/modules/util/file/uploadCropImage/template.html',
                {ratio: 1, uploadUrl: '/api/user/settings/uploadProfileImage'}).then(function () {
                UploadProfileImageState.profileImageChanged();
            });
        };

        ctrl.openChangePassword = function () {
            ElyModal.show('SettingChangePasswordCtrl', 'app/modules/settings/modal/changePassword/template.html');
        };

        ctrl.openChangeProfileData = function () {
            ElyModal.show('SettingChangeProfileDataCtrl', 'app/modules/settings/modal/changeProfileData/template.html');
        };

        ctrl.openPrivacyOverview = function () {
            ElyModal.show('OverviewGroupSettingController', 'app/modules/settings/modal/overviewGroupSettings/template.html');
        };

        ctrl.showPagesEnabled = function () {
            ctrl.showPagesSelected = true;
            ctrl.showContactsSelected = false;
            ctrl.showPages();
        };

        ctrl.showContactsEnabled = function () {
            ctrl.showPagesSelected = false;
            ctrl.showContactsSelected = true;
            ctrl.showContacts();
        };
        ctrl.showPagesEnabled();
    }];
