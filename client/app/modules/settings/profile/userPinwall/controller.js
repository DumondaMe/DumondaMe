'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UserPinwall', 'PinwallScrollRequestResponseHandler', 'ScrollRequest',
            function (UserPinwall, PinwallScrollRequestResponseHandler, ScrollRequest) {
                var ctrl = this;

                ctrl.user = {pinwall: []};
                ctrl.noPinwall = false;

                ScrollRequest.reset('UserPinwall', UserPinwall.get, PinwallScrollRequestResponseHandler);

                ctrl.nextPinwallInfo = function () {
                    ScrollRequest.nextRequest('UserPinwall', ctrl.user.pinwall).then(function (pinwall) {
                        ctrl.user = pinwall;
                        if (pinwall.pinwall.length === 0) {
                            ctrl.noPinwall = true;
                        }
                    });
                };

                ctrl.nextPinwallInfo();
            }];
    }
};

