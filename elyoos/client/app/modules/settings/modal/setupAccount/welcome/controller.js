'use strict';

module.exports = ['userInfo', function (userInfo) {
    var ctrl = this;

    ctrl.forename = userInfo.getUserInfo().forename;
}];
