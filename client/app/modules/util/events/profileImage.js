'use strict';

module.exports = [function () {
    var profileImageVersion = 1;
    this.addProfileImageChangedEvent = function (scope, imageObjectName) {
        scope.$on('elyoos.profileImage.change', function () {
            var profileImageObject = scope[imageObjectName];
            if (profileImageObject) {
                profileImageVersion = profileImageVersion + 1;
                profileImageObject.profileImage = profileImageObject.profileImage.split('?version=', 2)[0];
                profileImageObject.profileImage += '?version=' + profileImageVersion.toString();
            }
        });
    };
    return this;
}];
