import i18next from 'i18next';

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
        }
    }
};

export const actions = {};