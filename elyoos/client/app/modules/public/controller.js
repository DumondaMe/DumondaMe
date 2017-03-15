'use strict';

module.exports = ['$state', '$stateParams', 'ElyModal', '$mdMedia',
    function ($state, $stateParams, ElyModal, $mdMedia) {
        var ctrl = this;
        if ($mdMedia('gt-xs')) {
            ctrl.screenPreviewImage = "app/img/start/screenPreview.jpg";
        } else {
            ctrl.screenPreviewImage = "app/img/start/screenPreviewMobile.jpg";
        }

        if ($state.is('public.register.verify') && angular.isString($stateParams.linkId)) {
            ElyModal.show('LoginCtrl', 'app/modules/public/login/template.html', {});
        }
    }];
