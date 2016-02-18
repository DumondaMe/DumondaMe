'use strict';

var setContactActions = function ($scope) {
    $scope.contact.actions = [
        {
            text: "Nachricht senden",
            click: "sendMessage(contact.userId, contact.name)"
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
        return ['$scope', '$state', 'ContactUserActions', 'UrlCache',
            function ($scope, $state, ContactUserActions, UrlCache) {

                $scope.$scope = $scope;
                $scope.cacheUrl = UrlCache.cacheUrl;
                ContactUserActions.setPrivacySettings($scope);

                setContactActions($scope);

                angular.extend($scope, ContactUserActions);

                ContactUserActions.setConnectionState($scope);

                $scope.openUserDetails = function () {
                    $state.go('user.detail', {
                        userId: $scope.contact.userId
                    });
                };
            }];
    }
};
