'use strict';

module.exports = ['ElyModal', 'UserPinwall', 'ScrollRequest', 'PinwallScrollRequestResponseHandler', '$mdMedia', '$mdSidenav',
    function (ElyModal, UserPinwall, ScrollRequest, PinwallScrollRequestResponseHandler, $mdMedia, $mdSidenav) {
        var ctrl = this;

        ctrl.pinwall = {pinwall: []};
        ctrl.filterType = 'recommendation';
        ctrl.previousFilterType = 'recommendation';
        ctrl.$mdMedia = $mdMedia;

        ctrl.openNav = function () {
            $mdSidenav("right").toggle();
        };

        ctrl.showPages = function () {
            ctrl.showPagesView = true;
            ctrl.showContactsView = false;
        };

        ctrl.showContacts = function () {
            ctrl.showPagesView = false;
            ctrl.showContactsView = true;
        };

        ctrl.openCreatePage = function () {
            ElyModal.show('CreatePageNavCtrl', 'app/modules/navigation/createPage/template.html', {});
        };

        ctrl.openFilterDialog = function () {
            ElyModal.show('HomeScreenFilterCtrl', 'app/modules/home/modal/filter/template.html', {});
        };

        ctrl.filterTypeChanged = function () {
            if (ctrl.previousFilterType !== ctrl.filterType) {
                ctrl.previousFilterType = angular.copy(ctrl.filterType);
                ScrollRequest.reset('UserPinwall', UserPinwall.get, PinwallScrollRequestResponseHandler);
                ctrl.nextPinwallInfo();
            }
        };

        ScrollRequest.reset('UserPinwall', UserPinwall.get, PinwallScrollRequestResponseHandler);

        ctrl.nextPinwallInfo = function () {
            ScrollRequest.nextRequest('UserPinwall', ctrl.pinwall.pinwall, {type: ctrl.filterType}).then(function (pinwall) {
                ctrl.pinwall = pinwall;
                if (pinwall.pinwall.length === 0) {
                    ctrl.noPinwall = true;
                }
            });
        };
        ctrl.nextPinwallInfo();
    }];
