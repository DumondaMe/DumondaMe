'use strict';

module.exports = ['$scope', '$http', 'HttpService', function ($scope, $http, HttpService) {

    $scope.contact.typeNew = $scope.contact.type;

    $scope.contact.actions = [
        {
            text: "Nachricht senden",
            href: "#"
        },
        {
            divider: true
        },
        {
            text: "Kontakt löschen",
            click: "deleteContact()"
        }
    ];

    if ($scope.contact.blocked === true) {
        $scope.contact.actions.push({
            text: "Blockierung aufheben",
            href: "#"
        });
    } else {
        $scope.contact.actions.push({
            text: "Kontakt blockieren",
            href: "#"
        });
    }

    $scope.sendNewDescription = function () {
        var hide = this.$hide;
        if ($scope.contact.typeNew !== $scope.contact.type) {
            $http.post('/api/user/contact', {
                contactIds: [$scope.contact.id],
                mode: 'changeState',
                description: $scope.contact.typeNew
            }).then(function () {
                $scope.contact.type = $scope.contact.typeNew;
                hide();
            });
        }
    };

    $scope.addNewContact = function () {
        $http.post('/api/user/contact', {
            contactIds: [$scope.contact.id],
            mode: 'addContact',
            description: 'Freund'
        }).then(function () {
            $scope.contact.type = 'Freund';
        });
    };

    $scope.deleteContact = function () {
        HttpService.sendDeleteRequest({contactIds: [$scope.contact.id]}, '/api/user/contact')
            .then(function () {
                delete $scope.contact.type;
            });
    };
}];
