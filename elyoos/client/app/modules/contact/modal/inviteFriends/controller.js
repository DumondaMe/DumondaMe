'use strict';

module.exports = ['ImportGmailContacts', 'ElyModal', '$window', 'InviteFriendsTokenParser',
    function (ImportGmailContacts, ElyModal, $window, InviteFriendsTokenParser) {
        var ctrl = this;


        ctrl.openGmail = function () {
            var newWindow = $window.open('https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=270929621236-4cauqnck95vm8ohkvu3rokhp74jued28.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontacts.readonly&redirect_uri=http%3A%2F%2Flocalhost:8080%2Fauth', 'name',
                'height=600,width=450');
            if (angular.isFunction(newWindow.focus)) {
                newWindow.focus();
            }
            $window.elyChildWindowUrl = function (newUrl) {
                ctrl.contacts = ImportGmailContacts.get({token: InviteFriendsTokenParser.parseGoogleUrl(newUrl)});
            };

        };

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.accept = function (mode) {

        };
    }];
