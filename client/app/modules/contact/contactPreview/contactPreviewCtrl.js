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

var setPrivacySettings = function ($scope) {
    $scope.contact.selectedPrivacySetting = $scope.contact.type;
    $scope.contact.privacySettings = $scope.privacySettings;
};

var getPrivacyType = function (statistics, privacyTypes) {
    var setting = null;
    if (statistics && statistics.length > 0) {
        angular.forEach(statistics, function (statistic) {
            if (!setting || setting.count < statistic.count) {
                setting = statistic;
            }
        });
        return setting.type;
    }
    return privacyTypes[0].type;
};

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
            click: "deleteContact()"
        },
        {
            text: "Kontakt blockieren",
            click: "blockContact()"
        }
    ];
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$state', 'Contact', 'moment', 'ContactUserActions',
            function ($scope, $state, Contact, moment, ContactUserActions) {

                setPrivacySettings($scope);

                setContactActions($scope);

                $scope.tooltipConnectionState = {
                    title: "",
                    checked: false
                };

                $scope.sendNewDescription = function (hide) {
                    if ($scope.contact.selectedPrivacySetting) {
                        var contact = Contact.save({
                            contactIds: [$scope.contact.id],
                            mode: 'changeState',
                            description: $scope.contact.selectedPrivacySetting
                        }, function () {
                            $scope.statistic = contact.statistic;
                            $scope.contact.type = $scope.contact.selectedPrivacySetting;
                            hide();
                        });
                    }
                };

                $scope.addNewContact = function () {
                    var contact, privacyTyp;
                    privacyTyp = getPrivacyType($scope.statistic, $scope.contact.privacySettings);
                    contact = Contact.save({
                        contactIds: [$scope.contact.id],
                        mode: 'addContact',
                        description: privacyTyp
                    }, function () {
                        $scope.statistic = contact.statistic;
                        if (angular.isDefined($scope.numberOfContacts)) {
                            $scope.numberOfContacts = contact.numberOfContacts;
                        }
                        $scope.contact.type = privacyTyp;
                        updateConnectionStateWhenModifiyContact($scope);
                        setPrivacySettings($scope);
                    });
                };

                $scope.deleteContact = function () {
                    var contact = Contact.delete({
                        contactIds: [$scope.contact.id]
                    }, function () {
                        $scope.statistic = contact.statistic;
                        if (angular.isDefined($scope.numberOfContacts)) {
                            $scope.numberOfContacts = contact.numberOfContacts;
                        }
                        delete $scope.contact.type;
                        updateConnectionStateWhenDeletingContact($scope);
                    });
                };

                $scope.blockContact = function () {
                    var contact = Contact.save({
                        mode: 'blockContact',
                        contactIds: [$scope.contact.id]
                    }, function () {
                        $scope.statistic = contact.statistic;
                        if (angular.isDefined($scope.numberOfContacts)) {
                            $scope.numberOfContacts = contact.numberOfContacts;
                        }
                        delete $scope.contact.type;
                        $scope.contact.blocked = true;
                        updateConnectionStateWhenDeletingContact($scope);
                    });
                };

                $scope.unblockContact = function () {
                    var contact = Contact.save({
                        mode: 'unblockContact',
                        contactIds: [$scope.contact.id]
                    }, function () {
                        $scope.statistic = contact.statistic;
                        if (angular.isDefined($scope.numberOfContacts)) {
                            $scope.numberOfContacts = contact.numberOfContacts;
                        }
                        delete $scope.contact.type;
                        $scope.contact.blocked = false;
                    });
                };

                $scope.sendMessage = ContactUserActions.sendMessage;

                $scope.setConnectionState = function () {
                    if ($scope.contact.connected === 'userToContact') {
                        $scope.contact.connectionImage = 'app/img/userToContact.png';
                        $scope.tooltipConnectionState.title = "Du hast " + $scope.contact.name + " am "
                        + moment.unix($scope.contact.contactAdded).format('lll') + " als Kontakt hinzgefügt";
                    } else if ($scope.contact.connected === 'contactToUser') {
                        $scope.contact.connectionImage = 'app/img/contactToUser.png';
                        $scope.tooltipConnectionState.title = "Hat Dich am " + moment.unix($scope.contact.userAdded).format('lll') +
                        " als Kontakt hinzgefügt";
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

                $scope.openUserDetails = function () {
                    $state.go('contact.detail', {
                        userId: $scope.contact.id
                    });
                };
            }];
    }
};
