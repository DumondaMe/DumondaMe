import i18next from 'i18next';
import moment from 'moment';

export const state = () => ({
    languages: [
        {key: 'de', description: 'Deutsch'},
        {key: 'en', description: 'English'}
    ],
    language: 'de'
});

export const mutations = {
    SET_LANGUAGE: function (state, language) {
        if (state.language !== language) {
            i18next.changeLanguage(language);
            state.language = language;
            moment.locale(language);
        }
    }
};

export const actions = {
    setLanguage({commit}, {language}) {
        try {
            this.$axios.$put(`/user/language/${language}`);
            commit('SET_LANGUAGE', language);
        } catch (error) {

        }
    }
};