'use strict';

module.exports = ['$mdPanel', function ($mdPanel) {


    this.show = function (ev, controller, template, locals, position, attachTo, id, panelClass) {

        if (!locals) {
            locals = {};
        }
        var config = {
            clickOutsideToClose: true,
            escapeToClose: true,
            bindToController: true,
            openFrom: ev,
            controllerAs: 'ctrl',
            controller: controller,
            templateUrl: template,
            locals: locals,
            position: position,
            focusOnOpen: false,
            zIndex: 1001
        };

        if (id) {
            config.id = id;
        }
        if (panelClass) {
            config.panelClass = panelClass;
        }
        if (attachTo) {
            config.attachTo = attachTo;
        }

        return $mdPanel.open(config);
    };

    this.newPanelPosition = function () {
        return $mdPanel.newPanelPosition();
    };

    this.xPosition = $mdPanel.xPosition;
    this.yPosition = $mdPanel.yPosition;
}];
