'use strict';

module.exports = ['$scope', '$http', function ($scope, $http) {

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
            href: "#"
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
}];
