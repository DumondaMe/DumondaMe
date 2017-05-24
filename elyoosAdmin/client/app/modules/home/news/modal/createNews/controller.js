'use strict';

module.exports = ['ElyModal', 'News', 'errorToast',
    function (ElyModal, News, errorToast) {
        var ctrl = this;

        ctrl.abort = function () {
            ElyModal.cancel();
        };

        ctrl.sendNews = function () {
            ctrl.uploadRunning = true;
            News.save({title: ctrl.title, text: ctrl.text}, function (resp) {
                ctrl.uploadRunning = false;
                resp.text = ctrl.text;
                resp.title = ctrl.title;
                ElyModal.hide(resp);
            }, function () {
                ctrl.uploadRunning = false;
                errorToast.showError("Fehler beim erstellen einer News Meldung");
            });
        };
    }];

