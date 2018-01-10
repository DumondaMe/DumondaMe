import Vue from 'vue';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';

Vue.use(VueI18Next);

const i18n = new VueI18Next(i18next);

let setLanguage = function (store, req) {
    if (req && req.session && req.session.userData && req.session.userData.lang) {
        store.commit('i18n/SET_LANGUAGE', req.session.userData.lang);
    } else if (req && req.session) {
        if (!req.session.userData) {
            req.session.userData = {};
        }
        req.session.userData.lang = 'en';
        console.log(`Add new language 'en'`);
    }
};

export default ({app, store, req}) => {

    setLanguage(store, req);
    let lang = store.state.i18n.language;
    let resources = {};
    resources[`${lang}`] = {common: require(`~/locales/${lang}/common.json`)};
    i18next.init({
        lng: lang,
        resources: resources
    });

    app.i18n = i18n;
}
