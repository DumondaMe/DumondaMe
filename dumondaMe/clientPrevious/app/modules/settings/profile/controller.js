'use strict';

module.exports = ['ElyModal', 'UserPinwall', 'ScrollRequest', 'PinwallScrollRequestResponseHandler', '$mdMedia', '$mdSidenav',
    '$stateParams', '$state',
    function (ElyModal, UserPinwall, ScrollRequest, PinwallScrollRequestResponseHandler, $mdMedia, $mdSidenav,
              $stateParams, $state) {
        var ctrl = this;

        ctrl.filterType = 'adminNewest';
        ctrl.previousFilterType = 'adminNewest';
        ctrl.$mdMedia = $mdMedia;

        if ($stateParams.overview === 'contacts' || $stateParams.overview === 'contacting' ||
            $stateParams.overview === 'recommendation') {
            ctrl.showPagesView = false;
            ctrl.showContactsView = true;
        } else {
            ctrl.showPagesView = true;
            ctrl.showContactsView = false;
        }

        ctrl.openNav = function () {
            $mdSidenav("right").toggle();
        };

        ctrl.showPages = function () {
            ctrl.showPagesView = true;
            ctrl.showContactsView = false;
            ctrl.pinwall = {pinwall: []};
            ctrl.loadPinwallStarted = true;
            ScrollRequest.reset('UserPinwall', UserPinwall.get, PinwallScrollRequestResponseHandler);
            ctrl.nextPinwallInfo();
            $state.go('settings.profile', {overview: null}, {notify: false});
        };

        ctrl.showContacts = function () {
            var overviewContact;
            if ($stateParams.overview === 'contacts' || $stateParams.overview === 'contacting' ||
                $stateParams.overview === 'recommendation') {
                overviewContact = $stateParams.overview;
            } else {
                overviewContact = 'contacts';
            }
            ctrl.showPagesView = false;
            ctrl.showContactsView = true;
            $state.go('settings.profile', {overview: overviewContact}, {notify: false});
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
                ctrl.pinwall = {pinwall: []};
                ctrl.loadPinwallStarted = true;
                ctrl.nextPinwallInfo();
            }
        };

        ctrl.nextPinwallInfo = function () {
            ScrollRequest.nextRequest('UserPinwall', ctrl.pinwall.pinwall, {type: ctrl.filterType}).then(function (pinwall) {
                ctrl.pinwall = pinwall;
                ctrl.noPinwall = false;
                ctrl.loadPinwallStarted = false;
                if (pinwall.pinwall.length === 0) {
                    ctrl.noPinwall = true;
                }
            }, function () {
                ctrl.loadPinwallStarted = false;
            });
        };
    }];
