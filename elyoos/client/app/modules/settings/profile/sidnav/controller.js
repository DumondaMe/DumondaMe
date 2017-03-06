'use strict';

module.exports = ['ElyModal', 'UploadProfileImageState', '$mdSidenav', '$stateParams',
    function (ElyModal, UploadProfileImageState, $mdSidenav, $stateParams) {
        var ctrl = this;

        ctrl.showPagesSelected = true;
        ctrl.showContactsSelected = false;

        if ($stateParams.overview === 'contacts') {
            ctrl.showPagesSelected = false;
            ctrl.showContactsSelected = true;
            ctrl.showContacts();
        } else {
            ctrl.showPages();
        }

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
            $mdSidenav("right").toggle();
        };

        ctrl.showContactsEnabled = function () {
            ctrl.showPagesSelected = false;
            ctrl.showContactsSelected = true;
            ctrl.showContacts();
            $mdSidenav("right").toggle();
        };
    }];
