'use strict';

module.exports = ['ElyModal', function (ElyModal) {
    var ctrl = this;

    ctrl.filterOrder = 'admin';

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
        ElyModal.show('HomeScreenFilterCtrl', 'app/modules/home/modal/filter/template.html', {no});
    };
}];
