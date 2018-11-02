export const state = () => ({
    setting: {privacyMode: null, showProfileActivity: false}
});

export const mutations = {
    SET_USER_SETTING: function (state, setting) {
        state.setting = setting;
    }
};

export const actions = {
    async getSetting({commit}) {
        let setting = await this.$axios.$get(`user/settings`);
        commit('SET_USER_SETTING', setting);
    },
    async setPrivacy({commit}, {privacyMode, showProfileActivity}) {
        await this.$axios.$put(`user/settings/privacy`, {privacyMode, showProfileActivity});
        commit('SET_USER_SETTING', {privacyMode, showProfileActivity});
    }
};