'use strict';

module.exports = ['RecommendedContactScrollRequest', 'ContactGroupStatistic', 'StepperDialogScrollRequest',
    'Contact', 'errorToast', 'StepperDialogCommandHandler', 'ElyPanel', 'KnowUser',
    function (RecommendedContactScrollRequest, ContactGroupStatistic, StepperDialogScrollRequest, Contact,
              errorToast, StepperDialogCommandHandler, ElyPanel, KnowUser) {
        var ctrl = this;

        ctrl.isLoading = true;
        ctrl.users = {recommendedUser: []};
        RecommendedContactScrollRequest.reset();
        StepperDialogScrollRequest.setNextScrollRequestHandler(ctrl);

        ctrl.addContact = function (userId) {
            var groupName = ctrl.selectedGroup.group;
            StepperDialogCommandHandler.showProgressBar();
            if (angular.isObject(ctrl.selectedGroup) && groupName) {
                Contact.save({
                    contactIds: [userId],
                    mode: 'addContact',
                    description: groupName
                }, function () {
                    ctrl.users = {recommendedUser: []};
                    StepperDialogCommandHandler.hideProgressBar();
                    RecommendedContactScrollRequest.reset();
                    ctrl.nextContactRecommendations();
                    ContactGroupStatistic.addContactToGroup(groupName);
                }, function () {
                    StepperDialogCommandHandler.hideProgressBar();
                    errorToast.showError('Es ist ein Fehler aufgetretten!');
                });
            }
        };

        ctrl.showSameContact = function (event, userId, name) {
            var position = ElyPanel.newPanelPosition()
                .relativeTo('.sub-title-user-name-' + userId)
                .addPanelPosition(ElyPanel.xPosition.CENTER,
                    ElyPanel.yPosition.ALIGN_BOTTOMS);
            ElyPanel.show(event, 'PanelShowContactCtrl', 'app/modules/util/panel/showContact/template.html',
                {source: KnowUser, userId: userId, name: name}, position);
        };

        ctrl.nextScrollRequest = function () {
            if (ctrl.isActive) {
                ctrl.nextContactRecommendations();
            }
        };

        ctrl.nextContactRecommendations = function () {
            RecommendedContactScrollRequest.nextRequest(ctrl.users.recommendedUser).then(function (recommendedUsers) {
                ctrl.isLoading = false;
                ctrl.users = recommendedUsers;
            });
        };
        ctrl.nextContactRecommendations();
    }];
