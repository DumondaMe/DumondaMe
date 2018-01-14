import Vue from 'vue';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';

Vue.use(VueI18Next);

const i18n = new VueI18Next(i18next);

let setLanguage = function (store, req) {
    if (req && req.session) {
        if (!req.session.userData) {
            req.session.userData = {};
        }
        req.session.userData.lang = 'en';
        console.log(`Add new language 'en'`);
    }
};

export default ({app, store, req}) => {

    setLanguage(store, req);

    i18next.init({
        lng: store.state.i18n.language,
        resources: {
            en: {
                common: require(`~/locales/en/common.json`),
                pages: require(`~/locales/en/pages.json`),
                validation: require(`~/locales/en/validation.json`)
            },
            de: {
                common: require(`~/locales/de/common.json`),
                pages: require(`~/locales/de/pages.json`),
                validation: require(`~/locales/de/validation.json`)
            }
        }
    });

    app.i18n = i18n;

    if (req && req.session) {
        store.commit('i18n/SET_LANGUAGE', req.session.userData.lang);
    }
}
