'use strict';

module.exports = ['$state', '$stateParams', 'ElyModal',
    function ($state, $stateParams, ElyModal) {

        if ($state.is('public.register.verify') && angular.isString($stateParams.linkId)) {
            ElyModal.show('LoginCtrl', 'app/modules/public/login/template.html', {});
        }
    }];
