'use strict';

module.exports = ['ElyModal', 'ImportGmxContacts', 'ImportWebDeContacts',
    function (ElyModal, ImportGmxContacts, ImportWebDeContacts) {
        var ctrl = this;
        ctrl.selectedAddresses = [];

        ctrl.sourceImportStarted = function () {
            ctrl.importStarted = true;
        };

        ctrl.sourceImportFinish = function () {
            ctrl.importStarted = false;
        };

        ctrl.openBasicAuthGmx = function () {
            ctrl.basicAuthName = 'GMX';
            ctrl.basicAuthService = ImportGmxContacts;
            ctrl.showBasicAuth = true;
        };

        ctrl.openBasicAuthWebDe = function () {
            ctrl.basicAuthName = 'WEB.DE';
            ctrl.basicAuthService = ImportWebDeContacts;
            ctrl.showBasicAuth = true;
        };

        ctrl.closeBasicAuth = function () {
            ctrl.showBasicAuth = false;
        };

        ctrl.emailExists = function (item, selectedList) {
            return selectedList.indexOf(item) > -1;
        };

        ctrl.toggleEmail = function (item, selectedList) {
            var idx = selectedList.indexOf(item);
            if (idx > -1) {
                selectedList.splice(idx, 1);
            }
            else {
                selectedList.push(item);
            }
        };

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.accept = function (mode) {

        };
    }];
