'use strict';

module.exports = [function () {
    this.addProfileImageChangedEvent = function (scope, callback) {
        scope.$on('elyoos.profileImage.change', function () {
            callback();
        });
    };
    return this;
}];
