'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'Profile', 'UploadProfileImageState',
            function ($scope, Profile, UploadProfileImageState) {
                var ctrl = this;

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

