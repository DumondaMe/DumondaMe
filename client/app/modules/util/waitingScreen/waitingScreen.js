'use strict';

module.exports = ['$modal', '$rootScope', function ($modal, $rootScope) {

    this.openScreen = function (loadingText) {
        var confirm, modalParams = {}, finished;

        modalParams.scope = $rootScope.$new(false);
        modalParams.scope.title = loadingText;
        modalParams.templateUrl = 'app/modules/util/waitingScreen/waitingScreen.html';
        modalParams.animation = true;
        modalParams.backdrop = 'static';
        confirm = $modal.open(modalParams);

        finished = function () {
            confirm.close();
        };

        return finished;
    };
}];
