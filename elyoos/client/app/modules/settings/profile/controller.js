'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'Profile', 'UploadProfileImageState', '$mdMedia',
            function ($scope, Profile, UploadProfileImageState, $mdMedia) {
                var ctrl = this;
                ctrl.$mdMedia = $mdMedia;

                UploadProfileImageState.register('profilePreview', ctrl);

                ctrl.profileImageChangedEvent = function () {
                    ctrl.profile = Profile.get();
                };

                ctrl.profile = Profile.get();
                ctrl.commands = {};

                $scope.$on("$destroy", function () {
                    UploadProfileImageState.remove('profilePreview');
                });
            }];
    }
};

