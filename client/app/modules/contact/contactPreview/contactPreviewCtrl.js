'use strict';

var updateConnectionStateWhenAddingContact = function ($scope) {
    if ($scope.contact.connected === 'contactToUser') {
        $scope.contact.connected = 'both';
    } else {
        $scope.contact.connected = 'userToContact';
    }
    $scope.setConnectionState();
};

var updateConnectionStateWhenDeletingContact = function ($scope) {
    if ($scope.contact.connected === 'both') {
        $scope.contact.connected = 'contactToUser';
    } else {
        $scope.contact.connected = 'none';
    }
    $scope.setConnectionState();
};

module.exports = ['$scope', 'Contact', function ($scope, Contact) {

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
        //TODO Needs other implementation
    };

    $scope.addNewContact = function () {
        var contact = Contact.save({
            contactIds: [$scope.contact.id],
            mode: 'addContact',
            description: 'Freund'
        }, function () {
            if (angular.isDefined($scope.statistic)) {
                $scope.statistic = contact.statistic;
            }
            if (angular.isDefined($scope.numberOfContacts)) {
                $scope.numberOfContacts = contact.numberOfContacts;
            }
            $scope.contact.type = 'Freund';
            updateConnectionStateWhenAddingContact($scope);
        });
    };

    $scope.deleteContact = function () {
        var contact = Contact.delete({
            contactIds: [$scope.contact.id]
        }, function () {
            if (angular.isDefined($scope.statistic)) {
                $scope.statistic = contact.statistic;
            }
            if (angular.isDefined($scope.numberOfContacts)) {
                $scope.numberOfContacts = contact.numberOfContacts;
            }
            delete $scope.contact.type;
            updateConnectionStateWhenDeletingContact($scope);
        });
    };

    $scope.setConnectionState = function () {
        if ($scope.contact.connected === 'userToContact') {
            $scope.contact.connectionImage = 'app/img/userToContact.png';
        } else if ($scope.contact.connected === 'contactToUser') {
            $scope.contact.connectionImage = 'app/img/contactToUser.png';
        } else if ($scope.contact.connected === 'both') {
            $scope.contact.connectionImage = 'app/img/bothContact.png';
        } else {
            $scope.contact.connected = 'none';
            $scope.contact.connectionImage = '#';
        }
    };
    $scope.setConnectionState();
}];
