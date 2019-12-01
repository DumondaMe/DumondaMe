const i18next = require('i18next');

const init = function () {
    let resources = {
        de: {
            notification: require(`./de/notification.json`)
        },
        en: {
            notification: require(`./en/notification.json`)
        }
    };

    i18next.init({
        lng: 'de',
        resources
    });
};


module.exports = {
    init
};
