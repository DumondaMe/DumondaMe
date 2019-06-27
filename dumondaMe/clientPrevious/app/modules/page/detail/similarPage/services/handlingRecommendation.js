'use strict';

module.exports = [
    function () {
        var register;

        this.setRegister = function (newRegister) {
            register = newRegister;
        };

        this.pageRecommended = function () {
            register.pageRecommended();
        };
    }];
