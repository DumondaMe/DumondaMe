'use strict';

module.exports = ['$mdPanel',
    function () {
        var ctrl = this;
        ctrl.running = true;
        ctrl.contacts = ctrl.source.get({userId: ctrl.userId, skip: 0, maxItems: 10}, function () {
            ctrl.running = false;
            ctrl.additionalContacts = ctrl.contacts.totalNumberOfContacts - ctrl.contacts.contacts.length;
        });
    }];

