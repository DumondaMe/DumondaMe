'use strict';

var updateConnectionStateWhenModifiyContact = function ($scope) {
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

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'Contact', 'moment', function ($scope, Contact, moment) {

            $scope.contact.typeNew = $scope.contact.type;

            $scope.contact.selectedPrivacySetting = $scope.contact.type;
            $scope.contact.privacySettings = $scope.privacySettings;

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

            if ($scope.contact.blocked) {
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

            $scope.tooltipConnectionState = {
                title: "",
                checked: false
            };

            $scope.sendNewDescription = function () {
                if ($scope.contact.selectedPrivacySetting) {
                    var contact = Contact.save({
                        contactIds: [$scope.contact.id],
                        mode: 'changeState',
                        description: $scope.contact.selectedPrivacySetting
                    }, function () {
                        if (angular.isDefined($scope.statistic)) {
                            $scope.statistic = contact.statistic;
                        }
                        $scope.contact.type = $scope.contact.selectedPrivacySetting;
                    });
                }
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
                    updateConnectionStateWhenModifiyContact($scope);
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
                    $scope.tooltipConnectionState.title = "Du hast " + $scope.contact.name + " am "
                    + moment.unix($scope.contact.contactAdded).format('lll') + " als Kontakt hinzgefügt";
                } else if ($scope.contact.connected === 'contactToUser') {
                    $scope.contact.connectionImage = 'app/img/contactToUser.png';
                    $scope.tooltipConnectionState.title = "Hat Dich am " + moment.unix($scope.contact.userAdded).format('lll') + " als Kontakt hinzgefügt";
                } else if ($scope.contact.connected === 'both') {
                    $scope.contact.connectionImage = 'app/img/bothContact.png';
                    $scope.tooltipConnectionState.title = "Ihr habt Euch beide als Kontakte. Hat Dich am "
                    + moment.unix($scope.contact.userAdded).format('lll') + " als Kontakt hinzgefügt";
                } else {
                    $scope.contact.connected = 'none';
                    $scope.contact.connectionImage = '#';
                }
            };
            $scope.setConnectionState();
        }];
    }
};
