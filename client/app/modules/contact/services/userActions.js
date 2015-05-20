'use strict';

var setConnectionState = function ($scope, moment) {
    if ($scope.contact.connected === 'userToContact') {
        $scope.contact.connectionImage = 'app/img/userToContact.png';
        $scope.tooltipConnectionState.title = "Du hast " + $scope.contact.name + " am "
        + moment.unix($scope.contact.contactAdded).format('lll') + " als Kontakt hinzgef\u00fcgt";
    } else if ($scope.contact.connected === 'contactToUser') {
        $scope.contact.connectionImage = 'app/img/contactToUser.png';
        $scope.tooltipConnectionState.title = "Hat Dich am " + moment.unix($scope.contact.userAdded).format('lll') +
        " als Kontakt hinzgef\u00fcgt";
    } else if ($scope.contact.connected === 'both') {
        $scope.contact.connectionImage = 'app/img/bothContact.png';
        $scope.tooltipConnectionState.title = "Ihr habt Euch beide als Kontakte. Hat Dich am "
        + moment.unix($scope.contact.userAdded).format('lll') + " als Kontakt hinzgef\u00fcgt";
    } else {
        $scope.contact.connected = 'none';
        $scope.contact.connectionImage = '#';
    }
};

var updateConnectionStateWhenModifiyContact = function ($scope, moment) {
    if ($scope.contact.connected === 'contactToUser') {
        $scope.contact.connected = 'both';
    } else {
        $scope.contact.connected = 'userToContact';
    }
    setConnectionState($scope, moment);
};

var updateConnectionStateWhenDeletingContact = function ($scope, moment) {
    if ($scope.contact.connected === 'both') {
        $scope.contact.connected = 'contactToUser';
    } else {
        $scope.contact.connected = 'none';
    }
    setConnectionState($scope, moment);
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

var setPrivacySettings = function ($scope) {
    $scope.tooltipConnectionState = {
        title: "",
        checked: false
    };
    $scope.contact.selectedPrivacySetting = $scope.contact.type;
    $scope.contact.privacySettings = $scope.privacySettings;
};

module.exports = ['$state', '$modal', 'SearchThread', 'Contact', 'moment',
    function ($state, $modal, SearchThread, Contact, moment) {

        this.setPrivacySettings = setPrivacySettings;
        this.setConnectionState = function (scope) {
            setConnectionState(scope, moment);
        };

        this.openModalUpdateType = function ($scope) {
            $scope.send = $scope.updateType;
            $scope.actionDescription = '\u00c4ndern';
            $modal({
                scope: $scope,
                title: '\u00c4nderung der Privatsph\u00e4ren Einstellung f\u00fcr ' + $scope.contact.name,
                template: 'app/modules/contact/services/userActionsModalDescription.html',
                show: true,
                placement: 'center'
            });
        };

        this.updateType = function ($scope, hide) {
            if ($scope.contact.selectedPrivacySetting) {
                var contact = Contact.save({
                    contactIds: [$scope.contact.userId],
                    mode: 'changeState',
                    description: $scope.contact.selectedPrivacySetting
                }, function () {
                    $scope.statistic = contact.statistic;
                    $scope.contact.type = $scope.contact.selectedPrivacySetting;
                    hide();
                });
            }
        };

        this.openModalAddNewContact = function ($scope) {
            $scope.send = $scope.addNewContact;
            $scope.actionDescription = 'Hinzuf\u00fcgen';
            $scope.contact.selectedPrivacySetting = getPrivacyType($scope.statistic, $scope.contact.privacySettings);
            $modal({
                scope: $scope,
                title: 'Kontakt hinzuf\u00fcgen',
                template: 'app/modules/contact/services/userActionsModalDescription.html',
                show: true,
                placement: 'center'
            });
        };

        this.addNewContact = function ($scope, hide) {
            var contact;
            if ($scope.contact.selectedPrivacySetting) {
                contact = Contact.save({
                    contactIds: [$scope.contact.userId],
                    mode: 'addContact',
                    description: $scope.contact.selectedPrivacySetting
                }, function () {
                    $scope.statistic = contact.statistic;
                    if (angular.isDefined($scope.numberOfContacts)) {
                        $scope.numberOfContacts = contact.numberOfContacts;
                    }
                    $scope.contact.type = $scope.contact.selectedPrivacySetting;
                    updateConnectionStateWhenModifiyContact($scope, moment);
                    setPrivacySettings($scope);
                    hide();
                });
            }
        };

        this.deleteContact = function ($scope) {
            var contact = Contact.delete({
                contactIds: [$scope.contact.userId]
            }, function () {
                $scope.statistic = contact.statistic;
                if (angular.isDefined($scope.numberOfContacts)) {
                    $scope.numberOfContacts = contact.numberOfContacts;
                }
                delete $scope.contact.type;
                updateConnectionStateWhenDeletingContact($scope, moment);
            });
        };

        this.blockContact = function ($scope) {
            var contact = Contact.save({
                mode: 'blockContact',
                contactIds: [$scope.contact.userId]
            }, function () {
                $scope.statistic = contact.statistic;
                if (angular.isDefined($scope.numberOfContacts)) {
                    $scope.numberOfContacts = contact.numberOfContacts;
                }
                delete $scope.contact.type;
                $scope.contact.blocked = true;
                updateConnectionStateWhenDeletingContact($scope, moment);
            });
        };

        this.unblockContact = function ($scope) {
            var contact = Contact.save({
                mode: 'unblockContact',
                contactIds: [$scope.contact.userId]
            }, function () {
                $scope.statistic = contact.statistic;
                if (angular.isDefined($scope.numberOfContacts)) {
                    $scope.numberOfContacts = contact.numberOfContacts;
                }
                delete $scope.contact.type;
                $scope.contact.blocked = false;
            });
        };

        this.sendMessage = function (id, name) {
            var search = SearchThread.get({
                userId: id
            }, function () {
                if (search.hasExistingThread) {
                    $state.go('message.threads.detail', {
                        threadId: search.threadId,
                        isGroupThread: false
                    });
                } else {
                    $state.go('message.threads.create', {
                        userId: id,
                        name: name
                    });
                }
            });
        };
    }];
