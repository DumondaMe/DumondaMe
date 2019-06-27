'use strict';

module.exports = ['UserStateService', 'ContactGroupStatistic', 'ElyModal', '$state', 'ImageViewService',
    function (UserStateService, ContactGroupStatistic, ElyModal, $state, ImageViewService) {
        var ctrl = this;

        ctrl.moveContact = function () {
            UserStateService.moveContact(ctrl.detail.user.userId, ctrl.detail.user.name, ctrl.detail.user.type).then(function (newGroup) {
                ctrl.detail.user.type = newGroup;
            });
        };

        ctrl.addContact = function () {
            UserStateService.addContact(ctrl.detail.user.userId, ctrl.detail.user.name).then(function (type) {
                ctrl.detail.user.type = type;
                ContactGroupStatistic.addContactToGroup(ctrl.detail.user.type);
            });
        };

        ctrl.deleteContact = function () {
            UserStateService.deleteContact(ctrl.detail.user.userId).then(function () {
                ContactGroupStatistic.removeContactFromGroup(ctrl.detail.user.type);
                delete ctrl.detail.user.type;
            });
        };

        ctrl.blockContact = function () {
            UserStateService.blockContact(ctrl.detail.user.userId).then(function () {
                ctrl.detail.user.blocked = true;
            });
        };

        ctrl.unblockContact = function () {
            UserStateService.unblockContact(ctrl.detail.user.userId).then(function () {
                delete ctrl.detail.user.blocked;
                delete ctrl.detail.user.type;
            });
        };

        ctrl.writeMessage = function () {
            ElyModal.show('CreateMessageCtrl', 'app/modules/messages/conversation/createMessage/template.html',
                {destinationUserId: ctrl.detail.user.userId, description: ctrl.detail.user.name})
                .then(function (newMessage) {
                    $state.go('message.threads.detail', {threadId: newMessage.threadId});
                });
        };

        ctrl.openImageView = function () {
            ImageViewService.showImage(ctrl.detail.user.profileUrl);
        };
    }];

