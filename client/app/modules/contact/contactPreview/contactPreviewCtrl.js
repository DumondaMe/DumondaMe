'use strict';

var setContactActions = function ($scope) {
    $scope.contact.actions = [
        {
            text: "Nachricht senden",
            click: "sendMessage(contact.id)"
        },
        {
            divider: true
        },
        {
            text: "Kontakt löschen",
            click: "deleteContact($scope)"
        },
        {
            text: "Kontakt blockieren",
            click: "blockContact($scope)"
        }
    ];
};


module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$state', 'ContactUserActions',
            function ($scope, $state, ContactUserActions) {

                $scope.$scope = $scope;
                ContactUserActions.setPrivacySettings($scope);

                setContactActions($scope);

                angular.extend($scope, ContactUserActions);

                ContactUserActions.setConnectionState($scope);

                $scope.openUserDetails = function () {
                    $state.go('contact.detail', {
                        userId: $scope.contact.id
                    });
                };
            }];
    }
};
