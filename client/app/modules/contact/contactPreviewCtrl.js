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
        /*var hide = this.$hide;
        if ($scope.contact.typeNew !== $scope.contact.type) {
            $http.post('/api/user/contact', {
                contactIds: [$scope.contact.id],
                mode: 'changeState',
                description: $scope.contact.typeNew
            }).then(function () {
                $scope.contact.type = $scope.contact.typeNew;
                hide();
            });
         }*/
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
        /*HttpService.sendDeleteRequest({contactIds: [$scope.contact.id]}, '/api/user/contact')
            .then(function (statistic) {
                delete $scope.contact.type;
         $scope.users.statistic = statistic.statistic;
                $scope.users.numberOfContacts = statistic.numberOfContacts;
         });*/
    };
}]
;
