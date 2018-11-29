export const state = () => ({
    privacyMode: null,
    showProfileActivity: false
});

export const mutations = {
    SET_PRIVACY_MODE: function (state, privacyMode) {
        state.privacyMode = privacyMode;
    },
    SET_PRIVACY_SHOW_PROFILE_ACTIVITY: function (state, showProfileActivity) {
        state.showProfileActivity = showProfileActivity;
    }
};

export const actions = {
    async getSetting({commit}) {
        let setting = await this.$axios.$get(`user/settings`);
        commit('SET_PRIVACY_MODE', setting.privacyMode);
        commit('SET_PRIVACY_SHOW_PROFILE_ACTIVITY', setting.showProfileActivity);
    },
    async setPrivacy({commit}, {privacyMode, showProfileActivity}) {
        await this.$axios.$put(`user/settings/privacy`, {privacyMode, showProfileActivity});
        commit('SET_PRIVACY_MODE', privacyMode);
        commit('SET_PRIVACY_SHOW_PROFILE_ACTIVITY', showProfileActivity);
    },
    async setLanguages({commit}, languages) {
        await this.$axios.$put(`user/settings/languages`, {languages});
        commit('i18n/SET_LANGUAGES', languages, {root: true});
    }
};