'use strict';

module.exports = ['userInfo', function (userInfo) {
    var ctrl = this;

    ctrl.profileImage = userInfo.getUserInfo().profileImagePreview;
}];
