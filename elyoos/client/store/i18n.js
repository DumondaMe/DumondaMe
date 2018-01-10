export const state = () => ({
    language: 'de'
});

export const mutations = {
    SET_LANGUAGE: function (state, language) {
        state.language = language;
    }
};

export const actions = {};