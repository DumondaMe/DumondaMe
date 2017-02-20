'use strict';

module.exports = [function () {
    var ctrl = this;

    ctrl.loadAddressBook = function () {
        ctrl.contacts = ctrl.service.get({password: ctrl.password, username: ctrl.username}, function () {
            ctrl.finish();
        }, function () {
            ctrl.finish();
        });
    };
}];

