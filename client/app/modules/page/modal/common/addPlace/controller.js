'use strict';

var charCodeEnter = 13;

module.exports = ['PlaceSuggestion', '$mdMedia',
    function (PlaceSuggestion, $mdMedia) {
        var ctrl = this;

        ctrl.$mdMedia = $mdMedia;

        ctrl.searchPlace = function () {
            ctrl.requestStarted = true;
            ctrl.places = PlaceSuggestion.query({place: ctrl.data.place}, function () {
                ctrl.requestStarted = false;
                if (ctrl.places.length > 0) {
                    ctrl.lastRequestString = ctrl.data.place;
                    ctrl.selectedPlace = ctrl.places[0];
                }
            }, function () {
                ctrl.requestStarted = false;
            });
        };

        ctrl.keyPressed = function ($event) {
            if ($event.charCode === charCodeEnter || $event.keyCode === charCodeEnter) {
                ctrl.searchPlace();
            }
        };

    }];

