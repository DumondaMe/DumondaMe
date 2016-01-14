'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$mdMedia', function ($mdMedia) {
            var ctrl = this;

            ctrl.$mdMedia = $mdMedia;
        }];
    }
};
