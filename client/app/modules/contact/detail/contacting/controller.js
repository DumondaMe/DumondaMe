'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$state',
            function ($state) {
                var ctrl = this;

                ctrl.openUserDetail = function (userId) {
                    $state.go('user.detail', {userId: userId});
                };
            }];
    }
};

