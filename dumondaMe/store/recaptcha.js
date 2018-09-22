export const state = () => ({
    siteKey: null
});

export const mutations = {
    SET_RECAPTCHA_SITE_KEY: function (state, siteKey) {
        state.siteKey = siteKey;
    }
};