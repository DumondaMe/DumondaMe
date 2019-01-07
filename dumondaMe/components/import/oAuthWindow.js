export default {
    open: function (oAuthUrl, importFinish) {
        let newWindow = window.open(oAuthUrl, 'name', 'height=600,width=450'), intervalCheckWindow;

        if (typeof newWindow.focus === 'function') {
            newWindow.focus();
        }

        intervalCheckWindow = setInterval(function () {
            if (newWindow === null || newWindow.closed) {
                clearInterval(intervalCheckWindow);
                intervalCheckWindow = null;
                importFinish();
            }
        }, 500);
        window.dumondaMeChildWindowUrl = async function (newUrl) {
            await importFinish(newUrl);
        };
        return {interval: intervalCheckWindow, window: newWindow};
    }
}