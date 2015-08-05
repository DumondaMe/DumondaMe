'use strict';

module.exports = ['$modal', '$rootScope', function ($modal, $rootScope) {

    this.openScreen = function (loadingText) {
        var confirm, modalParams = {}, finished;

        modalParams.scope = $rootScope.$new(false);
        modalParams.show = true;
        modalParams.html = true;
        modalParams.templateUrl = 'app/modules/util/waitingScreen/waitingScreen.html';
        modalParams.placement = 'center';
        modalParams.backdrop = 'static';
        modalParams.title = loadingText;
        confirm = $modal(modalParams);

        finished = function () {
            confirm.hide();
        };

        return finished;
    };
}];
