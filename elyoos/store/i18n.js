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
            state.language = language;
            moment.locale(language);
        }
    }
};

export const actions = {
    async setLanguage({commit}, {language}) {
        try {
            await this.$axios.$put(`/user/language/${language}`);
            location.reload(true);
        } catch (error) {

        }
    }
};