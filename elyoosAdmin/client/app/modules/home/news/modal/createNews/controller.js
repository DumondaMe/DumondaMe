'use strict';

module.exports = ['ElyModal', 'News', 'NewsPreview', 'errorToast',
    function (ElyModal, News, NewsPreview, errorToast) {
        var ctrl = this;

        ctrl.abort = function () {
            ElyModal.cancel();
        };

        ctrl.sendPreviewNews = function () {
            ctrl.uploadRunning = true;
            NewsPreview.save({title: ctrl.title, text: ctrl.text}, function () {
                ctrl.uploadRunning = false;
                ctrl.newPreviewSent = true;
            }, function () {
                ctrl.uploadRunning = false;
                errorToast.showError("Fehler beim senden einer Preview News Meldung");
            });
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

