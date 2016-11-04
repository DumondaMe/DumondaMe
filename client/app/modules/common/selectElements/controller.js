'use strict';

var charCodeEnter = 13;

module.exports = ['SelectElementsResponseHandler', 'ScrollRequest', 'SelectElementsCheckBoxHandler',
    function (SelectElementsResponseHandler, ScrollRequest, SelectElementsCheckBoxHandler) {
        var ctrl = this;

        ctrl.suggestionKeyword = '';
        ctrl.overview = {};
        ctrl.selected = [];

        ctrl.toggle = SelectElementsCheckBoxHandler.toggle;
        ctrl.exists = SelectElementsCheckBoxHandler.exists;

        ScrollRequest.reset('selectElements', ctrl.overviewService.get, SelectElementsResponseHandler);

        ctrl.getSuggestionKeyword = function (keyword) {
            ctrl.suggestion = ctrl.suggestionService.get({search: keyword}, function () {
                ctrl.lastRequestString = keyword;
            });
        };

        ctrl.deleteSuggestion = function () {
            ctrl.suggestionKeyword = '';
            delete ctrl.suggestion;
        };

        ctrl.keyPressed = function ($event) {
            if ($event.charCode === charCodeEnter || $event.keyCode === charCodeEnter) {
                ctrl.getSuggestionKeyword(ctrl.suggestionKeyword);
            }
        };

        ctrl.suggestionKeywordChanged = function () {
            if (ctrl.suggestionKeyword.trim() === '') {
                ctrl.deleteSuggestion();
            }
        };

        ctrl.nextElements = function () {
            ScrollRequest.nextRequest('selectElements', ctrl.overview.elements).then(function (overview) {
                ctrl.overview = overview;
            });
        };

        ctrl.nextElements();
    }];

