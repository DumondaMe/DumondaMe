'use strict';

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
            $scope.users.statistic = contact.statistic;
            $scope.users.numberOfContacts = contact.numberOfContacts;
            $scope.contact.type = 'Freund';
        });
    };

    $scope.deleteContact = function () {
        var contact = Contact.delete({
            contactIds: [$scope.contact.id]
        }, function () {
            $scope.users.statistic = contact.statistic;
            $scope.users.numberOfContacts = contact.numberOfContacts;
            delete $scope.contact.type;
        });
    };

    $scope.showConnectionState = function () {
        if ($scope.contact.connected === 'none') {
            return false;
        }
        return true;
    };

    $scope.getConnectionState = function () {
        if ($scope.contact.connected === 'userToContact') {
            return 'app/img/userToContact.png';
        }
        if ($scope.contact.connected === 'contactToUser') {
            return 'app/img/contactToUser.png';
        }
        if ($scope.contact.connected === 'both') {
            return 'app/img/bothContact.png';
        }
        return '#';
    };
}];
