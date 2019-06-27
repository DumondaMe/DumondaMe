'use strict';

module.exports = ['UserStateService', 'ContactGroupStatistic', 'UserDetailNavigation', 'userInfo', 'ElyPanel',
    'KnowUser',
    function (UserStateService, ContactGroupStatistic, UserDetailNavigation, userInfo, ElyPanel, KnowUser) {
        var ctrl = this;
        ctrl.isUser = userInfo.getUserInfo().userId === ctrl.user.userId;

        ctrl.addContact = function () {
            UserStateService.addContact(ctrl.user.userId, ctrl.user.name).then(function (type) {
                ctrl.user.type = type;
                ContactGroupStatistic.addContactToGroup(ctrl.user.type);
                if (angular.isFunction(ctrl.addedContactEvent)) {
                    ctrl.addedContactEvent(ctrl.user.userId);
                }
            });
        };

        ctrl.deleteContact = function () {
            UserStateService.deleteContact(ctrl.user.userId).then(function () {
                ContactGroupStatistic.removeContactFromGroup(ctrl.user.type);
                delete ctrl.user.type;
            });
        };

        ctrl.unblockContact = function () {
            UserStateService.unblockContact(ctrl.user.userId).then(function () {
                delete ctrl.user.blocked;
            });
        };

        ctrl.goToDetail = function () {
            UserDetailNavigation.openUserDetail(ctrl.user.userId, ctrl.isUser);
        };

        ctrl.showSameContact = function (event, userId, name) {
            var position = ElyPanel.newPanelPosition()
                .relativeTo('.number-of-same-contacts-' + userId)
                .addPanelPosition(ElyPanel.xPosition.CENTER,
                    ElyPanel.yPosition.ALIGN_BOTTOMS);
            ElyPanel.show(event, 'PanelShowContactCtrl', 'app/modules/util/panel/showContact/template.html',
                {source: KnowUser, userId: userId, name: name}, position);
        };
    }];

