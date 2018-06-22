import moment from 'moment';

export const state = () => ({
    languages: [
        {key: 'de', description: 'DE'},
        {key: 'en', description: 'EN'}
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
            await this.$axios.$put(`/admin/language/${language}`);
            location.reload(true);
        } catch (error) {

        }
    }
};