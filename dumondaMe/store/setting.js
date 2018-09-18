export const state = () => ({
    setting: {privacyMode: null}
});

export const mutations = {
    SET_USER_SETTING: function (state, setting) {
        state.setting = setting;
    },
    SET_USER_PRIVACY_MODE: function (state, privacyMode) {
        state.setting.privacyMode = privacyMode;
    }
};

export const actions = {
    async getSetting({commit}) {
        let setting = await this.$axios.$get(`user/settings`);
        commit('SET_USER_SETTING', setting);
    },
    async setPrivacy({commit}, privacyMode) {
        await this.$axios.$put(`user/settings/privacy`, {privacyMode});
        commit('SET_USER_PRIVACY_MODE', privacyMode);
    }
};