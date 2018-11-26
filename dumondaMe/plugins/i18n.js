import Vue from 'vue';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import parser from 'accept-language-parser';

Vue.use(VueI18Next);

const i18n = new VueI18Next(i18next);

const getLanguageOfBrowser = function (acceptLanguage) {
    let languages = parser.parse(acceptLanguage);
    for (let language of languages) {
        if (language.code && language.code.toLowerCase)
            if (['en', 'de'].includes(language.code.toLowerCase())) {
                return {lang: language.code.toLowerCase()}
            }
    }
    return {lang: 'de'}
};

let setLanguage = function (store, req) {
    if (req && req.session) {
        if (!req.session.userData || (req.session.userData && !req.session.userData.lang)) {
            req.session.userData = getLanguageOfBrowser(req.headers["accept-language"]);
        }
        store.commit('i18n/SET_LANGUAGE', req.session.userData.lang);
    }
};

export default ({app, store, req}) => {

    setLanguage(store, req);

    let resources = {}, lang = store.state.i18n.language;
    resources[lang] = {
        common: require(`~/locales/${lang}/common.json`),
        dialog: require(`~/locales/${lang}/dialog.json`),
        pages: require(`~/locales/${lang}/pages.json`),
        validation: require(`~/locales/${lang}/validation.json`)
    };

    i18next.init({
        lng: store.state.i18n.language,
        resources
    });

    app.i18n = i18n;
}
