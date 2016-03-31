'use strict';

module.exports = ['ElyModal', 'moment', 'CountryCodeConverter',
    function (ElyModal, moment, CountryCodeConverter) {
        var ctrl = this;

        if (ctrl.detail.female) {
            ctrl.gender = 'Frau';
        } else {
            ctrl.gender = 'Mann';
        }

        if (ctrl.detail.hasOwnProperty('country')) {
            ctrl.detail.country = CountryCodeConverter.getCountry(ctrl.detail.country);
        }
        if (ctrl.detail.hasOwnProperty('birthday')) {
            ctrl.detail.birthday = moment.unix(ctrl.detail.birthday).format('l');
        }

        ctrl.close = function () {
            ElyModal.hide();
        };
    }];

