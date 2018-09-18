'use strict';

module.exports = ['ElyModal', 'News', 'errorToast', 'dateFormatter',
    function (ElyModal, News, errorToast, dateFormatter) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.getTime;
        ctrl.original = {title: ctrl.title, text: ctrl.text};
        ctrl.isEqual = true;

        ctrl.abort = function () {
            ElyModal.cancel();
        };

        ctrl.checkIsEqual = function () {
            ctrl.isEqual = angular.equals(ctrl.original, {title: ctrl.title, text: ctrl.text});
        };

        ctrl.updateNews = function () {
            ctrl.uploadRunning = true;
            News.modifiy({newsId : ctrl.newsId, title: ctrl.title, text: ctrl.text}, function (resp) {
                ctrl.uploadRunning = false;
                resp.text = ctrl.text;
                resp.title = ctrl.title;
                resp.newsId = ctrl.newsId;
                ElyModal.hide(resp);
            }, function () {
                ctrl.uploadRunning = false;
                errorToast.showError("Fehler beim verändern einer News Meldung");
            });
        };
    }];

