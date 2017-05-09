'use strict';

module.exports = ['$state', 'UserStateService', 'ContactGroupStatistic', 'RecommendedUserOnHomeSetting', 'ArrayHelper',
    'ElyPanel', 'KnowUser',
    function ($state, UserStateService, ContactGroupStatistic, RecommendedUserOnHomeSetting, ArrayHelper,
              ElyPanel, KnowUser) {
        var ctrl = this;

        ctrl.addContact = function (userId, name) {
            UserStateService.addContact(userId, name).then(function (type) {
                ArrayHelper.removeElement(ctrl.recommendedUser, 'userId', userId);
                ContactGroupStatistic.addContactToGroup(type);
                ctrl.reloadPinwall();
            });
        };

        ctrl.hideContactSuggestion = function () {
            RecommendedUserOnHomeSetting.save({showOnHomeScreen: false}, function () {
                ctrl.recommendedUser.length = 0;
            });
        };

        ctrl.showSameContact = function (event, userId, name) {
            var position = ElyPanel.newPanelPosition()
                .relativeTo('.sub-title-user-name-' + userId)
                .addPanelPosition(ElyPanel.xPosition.CENTER,
                    ElyPanel.yPosition.ALIGN_BOTTOMS);
            ElyPanel.show(event, 'PanelShowContactCtrl', 'app/modules/util/panel/showContact/template.html',
                {source: KnowUser, userId: userId, name: name}, position);
        };
    }];

