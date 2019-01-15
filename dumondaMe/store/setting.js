export const state = () => ({
    privacyMode: null,
    showProfileActivity: false,
    emailNotifications: {}
});

export const mutations = {
    SET_PRIVACY_MODE: function (state, privacyMode) {
        state.privacyMode = privacyMode;
    },
    SET_PRIVACY_SHOW_PROFILE_ACTIVITY: function (state, showProfileActivity) {
        state.showProfileActivity = showProfileActivity;
    },
    SET_EMAIL_NOTIFICATION: function (state, emailNotifications) {
        state.emailNotifications = emailNotifications;
    },
};

export const actions = {
    async getSetting({commit}) {
        let setting = await this.$axios.$get(`user/settings`);
        commit('SET_PRIVACY_MODE', setting.privacyMode);
        commit('SET_PRIVACY_SHOW_PROFILE_ACTIVITY', setting.showProfileActivity);
        commit('SET_EMAIL_NOTIFICATION', setting.emailNotifications);
    },
    async setPrivacy({commit}, {privacyMode, showProfileActivity}) {
        await this.$axios.$put(`user/settings/privacy`, {privacyMode, showProfileActivity});
        commit('SET_PRIVACY_MODE', privacyMode);
        commit('SET_PRIVACY_SHOW_PROFILE_ACTIVITY', showProfileActivity);
    },
    async setEmailNotification({commit}, {enableEmailNotifications, enableInviteToAnswerQuestion}) {
        await this.$axios.$put(`user/settings/emailNotifications`,
            {enableEmailNotifications, enableInviteToAnswerQuestion});
        commit('SET_EMAIL_NOTIFICATION', {enableEmailNotifications, enableInviteToAnswerQuestion});
    },
    async setLanguages({commit}, languages) {
        await this.$axios.$put(`user/settings/languages`, {languages});
        commit('i18n/SET_LANGUAGES', languages, {root: true});
    }
};